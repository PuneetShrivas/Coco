import dotenv
dotenv.load_dotenv()
import os
import time
from langchain import hub
import json
from typing import List, Literal
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_community.callbacks import get_openai_callback
from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
)

# import langchain 
# langchain.debug = True

class Recommendation(BaseModel):
    terms_upper: List[str] = Field(description="search terms to filter clothing items", example=["floral", "formal", "flowing"])
    colors_upper: List[str] = Field(description="search terms to filter clothing items", example=["red", "magenta"])
    terms_lower: List[str] = Field(description="search terms to filter clothing items", example=["jeans", "levis"])
    colors_lower: List[str] = Field(description="search terms to filter clothing items", example=["blue", "black"])

class RouteQuery(BaseModel):
    """Route a user query to the most relevant datasource."""

    datasource: Literal["recommend", "converse"] = Field(
        ...,
        description="Given a user question choose to route it to web search or a vectorstore.",
    )

llm = ChatOpenAI(model="gpt-3.5-turbo")

# # Load, chunk and index the contents of the blog.
# loader = WebBaseLoader(
#     web_paths=(
#         "https://veaves.in/blogs/blog/dress-ideas-for-a-casual-day-out-comfort-and-style-combined",
#         "https://veaves.in/blogs/blog/fashionable-womens-outfit-ideas-for-a-weekend-brunch",
#     ),
# )
# docs = loader.load()

# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
# splits = text_splitter.split_documents(docs)
# vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings(), persist_directory="chromadb")
# vectorstore.persist()
# Retrieve and generate using the relevant snippets of the blog.
vectorstore = Chroma(persist_directory="chromadb", embedding_function=OpenAIEmbeddings())

retriever = vectorstore.as_retriever()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

few_shot_examples = [
    {"input":"What goes good for a 25 year old female for a date night dress?",
     "output":"""{
  "terms_upper": ["dressy top", "blouse", "crop top"],
  "colors_upper": ["red", "black", "emerald green"],
  "terms_lower": ["skirt", "high-waisted jeans", "palazzos"],
  "colors_lower": ["black", "white", "beige"]
}"""},
    {"input":"What goes good for a 25 year old male for a formal interview?",
     "output":"""{
  "terms_upper": ["button-down shirt", "formal shirt", "linen shirt"],
  "colors_upper": ["white", "light blue", "light pink"],
  "terms_lower": ["formal trousers", "chinos", "dress pants"],
  "colors_lower": ["navy blue", "black", "charcoal grey"]
}"""},
]

few_shot_template = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}"),
        ("ai", "{output}")
    ]
)

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=few_shot_template,
    examples=few_shot_examples,
)

conversational_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an experienced stylist in India in 2024. Answer the user's questions to the best of your ability using the context provided. Do not explicitly quote or mention the context, only use it for your reference."""),
    ("user", "{question}"),
    ("user", "{context}"),
])

recommendation_prompt = ChatPromptTemplate.from_messages([
    ("system","""You are a stylist in India in 2024. For the given user's query help in finding a good combination of an upperwear apparel and a bottom wear by giving search terms and colors for each. Give the output in this JSON format: 
{{{{
    "terms_upper": ["floral", "formal", "flowing"],
    "colors_upper": ["red", "magenta"],
    "terms_lower": ["jeans", "levis"],
    "colors_lower": ["blue", "black"]
}}}}

If you don't find the answer in context, answer yourself but in the same JSON format.Do not explicitly quote or mention the context, only use it for your reference."""),
    few_shot_prompt,
    ("user","{question}"),
    ("user", "{context}"),
])

recommend_rag_chain_from_docs = (
    RunnablePassthrough.assign(context=(lambda x: format_docs(x["context"])))
    | recommendation_prompt
    | llm
    | JsonOutputParser(pydantic_object=Recommendation)
)

converse_rag_chain_from_docs = (
    RunnablePassthrough.assign(context=(lambda x: format_docs(x["context"])))
    | conversational_prompt
    | llm
    | StrOutputParser()
)

recommend_rag_chain_with_source = RunnableParallel(
    {"context": retriever, "question": RunnablePassthrough()}
).assign(answer=recommend_rag_chain_from_docs)

converse_rag_chain_with_source = RunnableParallel(
    {"context": retriever, "question": RunnablePassthrough()}
).assign(answer=converse_rag_chain_from_docs)


def generate_recommendation(query):
    return (recommend_rag_chain_with_source.invoke(query)['answer'])

def reply_conversation(query):
    return (converse_rag_chain_with_source.invoke(query)['answer'])

def answer_query(query): 
    structured_llm_router = llm.with_structured_output(RouteQuery)

    system = """You are an expert at routing a user question to either recommend or converse.
    Recommend for questions where the user is asking to generate styling recommendation. Use it when they are asking for styling ideas or outfits. 
    Converse for their general conversational questions or questions on these topics like is some dress combination a good idea etc."""
    route_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "{question}"),    
        ]
    )
    response = None
    question_router = route_prompt | structured_llm_router
    if question_router.invoke({"question": query}).datasource == "converse":
        response = reply_conversation(query)
    else:
        response = generate_recommendation(query)
    return response
    
    
with get_openai_callback() as cb:
    print(answer_query("what should i wear with a denim jacket"))
    print(answer_query("is it a good idea to wear sandals with a denim jacket"))
    # output = {}
    # curr_key = None
    # for chunk in rag_chain_with_source.stream("What goes good with sandals"):
    #     for key in chunk:
    #         if key not in output:
    #             output[key] = chunk[key]
    #         else:
    #             output[key] += chunk[key]
    #         if key != curr_key:
    #             print(f"\n\n{key}: {chunk[key]}", end="", flush=True)
    #         else:
    #             print(chunk[key], end="", flush=True)
    #         curr_key = key
    # print(output)
    
    print(cb)
