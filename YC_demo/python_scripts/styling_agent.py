from langchain.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.callbacks import get_openai_callback
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_community.vectorstores import Chroma
from typing import List, Literal, Dict, Any
import dotenv
from fastapi import FastAPI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
dotenv.load_dotenv()
import firebase_admin
from firebase_admin import credentials, firestore
# import langchain
# langchain.debug = True

cred = credentials.Certificate(r'C:\Users\punee\OneDrive\Documents\GitHub\Coco\firestore_key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this according to your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str = Field(description="Enter a request here")
    prev_messages: int = Field(description="number of previous messages to use")


class Recommendation(BaseModel):
    terms_upper: List[str] = Field(description="search terms to filter clothing items", example=[
                                   "floral", "formal", "flowing"])
    colors_upper: List[str] = Field(
        description="search terms to filter clothing items", example=["red", "magenta"])
    terms_lower: List[str] = Field(
        description="search terms to filter clothing items", example=["jeans", "levis"])
    colors_lower: List[str] = Field(
        description="search terms to filter clothing items", example=["blue", "black"])


class RouteQuery(BaseModel):
    """Route a user query to the most relevant datasource."""

    datasource: Literal["recommend", "converse"] = Field(
        ...,
        description="Given a user question choose to route it to web search or a vectorstore.",
    )

llm = ChatOpenAI(model="gpt-3.5-turbo")

vectorstore = Chroma(persist_directory="chromadb",
                     embedding_function=OpenAIEmbeddings())

retriever = vectorstore.as_retriever()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def format_chat_history(history_array):
    formatted_history = ""
    for message in history_array:
        formatted_history += f"Human: {message['Human']}\n"
        formatted_history += f"AI: {message['AI']}\n"

    # Remove trailing newline
    return formatted_history.replace("{", "").replace("}", "").strip()


few_shot_examples = [
    {"input": "What goes good for a 25 year old female for a date night dress?",
     "output": """{
  "terms_upper": ["dressy top", "blouse", "crop top"],
  "colors_upper": ["red", "black", "emerald green"],
  "terms_lower": ["skirt", "high-waisted jeans", "palazzos"],
  "colors_lower": ["black", "white", "beige"]
}"""},
    {"input": "What goes good for a 25 year old male for a formal interview?",
     "output": """{
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

def format_json_as_paragraph(data, depth=0):
    
    paragraph = ""
    indent = "  " * depth  # Indentation based on depth

    if isinstance(data, dict):
        for key, value in data.items():
            paragraph += f"{indent}{key.capitalize()}: "

            if isinstance(value, (dict, list)):  
                # Recursive call for nested dictionaries/lists
                paragraph += format_json_as_paragraph(value, depth + 1) + "\n"  
            elif isinstance(value, list) and all(isinstance(item, str) for item in value):
                # Special handling for lists of strings
                paragraph += ", ".join(value) + "\n"
            else:
                paragraph += str(value) + "\n"
    elif isinstance(data, list):
        for index, item in enumerate(data):
            if isinstance(item, (dict, list)):
                paragraph += f"{indent}- Item {index + 1}:\n"
                paragraph += format_json_as_paragraph(item, depth + 1) + "\n"  # Recursive call
            else:
                paragraph += f"{indent}- {item}\n"

    return paragraph.strip()  # Remove trailing newline


def format_preferences_to_text(preferences_data):
    formatted_text = ""
    
    for section, data in preferences_data.items():
        formatted_text += f"\n## {section.capitalize()}:\n"
        
        for category, items in data.items():
            formatted_text += f"- {category.capitalize()}: "

            # Check if it's a list (for combinations)
            if isinstance(items, list):
                # Special handling for list of strings (like combinations)
                if all(isinstance(item, str) for item in items):
                    formatted_text += ", ".join(items) 
                else:
                    # Handle other types of lists if needed
                    formatted_text += str(items) 

            else:
                formatted_text += items
            formatted_text += "\n"
    
    return formatted_text

def get_user_metas(doc_id):
    collection_name = 'user_metas'
    doc_ref = db.collection(collection_name).document(doc_id)
    doc = doc_ref.get()
    if doc.exists:
        return(format_json_as_paragraph(doc.to_dict()))
    else:
        return("No user metas available")
    
def get_user_prefs(doc_id):
    collection_name = 'user_prefs'
    doc_ref = db.collection(collection_name).document(doc_id)
    doc = doc_ref.get()
    if doc.exists:
        return(format_preferences_to_text(doc.to_dict()))
    else:
        return("No user metas available")
    
def get_user_docstrings(user_id):
    collection_name = 'users'
    doc_ref = db.collection(collection_name).document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        metas_id = doc.get("metas_id").get().id
        prefs_id = doc.get("prefs_id").get().id
        return get_user_metas(metas_id)+get_user_prefs(prefs_id)
    else:
        return ""


def generate_recommendation(query, chat_history, user_id):
    recommendation_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a stylist in India in 2024. For the given user's query help in finding a good combination of an upperwear apparel and a bottom wear by giving search terms and colors for each. Give the output in this JSON format: 
{{{{
    "terms_upper": ["floral", "formal", "flowing"],
    "colors_upper": ["red", "magenta"],
    "terms_lower": ["jeans", "levis"],
    "colors_lower": ["blue", "black"]
}}}}

If you don't find the answer in context, answer yourself but in the same JSON format.Do not explicitly quote or mention the context, only use it for your reference.
information about the user: 
{0}
following is the previous message history {1}. Now answer continuing to this conversation: """.format(get_user_docstrings(user_id), format_chat_history(chat_history))),
        few_shot_prompt,
        # MessagesPlaceholder(variable_name="history"),
        ("user", "{question}"),
        ("user", "{context}"),
    ])

    recommend_rag_chain_from_docs = (
        RunnablePassthrough.assign(
            context=(lambda x: format_docs(x["context"])))
        | recommendation_prompt
        | llm
        | JsonOutputParser(pydantic_object=Recommendation)
    )

    recommend_rag_chain_with_source = RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    ).assign(answer=recommend_rag_chain_from_docs)

    return (recommend_rag_chain_with_source.invoke(query)['answer'])



def reply_conversation(query, chat_history, user_id):
    conversational_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an experienced stylist in India in 2024. Answer the user's questions to the best of your ability using the context provided. Do not explicitly quote or mention the context, only use it for your reference. Remember to keep your response crisp and to the point as is asked by the user.

following is the previous message history {0}. Now answer continuing to this conversation: """.format( format_chat_history(chat_history))),
        # MessagesPlaceholder(variable_name="history"),
        ("user", "{question}"),
        ("user", "{context}"),
    ])

    converse_rag_chain_from_docs = (
        RunnablePassthrough.assign(
            context=(lambda x: format_docs(x["context"])),
        )
        | conversational_prompt
        | llm
        | StrOutputParser()
    )

    converse_rag_chain_with_source = RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    ).assign(answer=converse_rag_chain_from_docs)
    return (converse_rag_chain_with_source.invoke(query)['answer'])


def answer_query(query, chat_history, user_id):
    structured_llm_router = llm.with_structured_output(RouteQuery)

    system = """You are an expert at routing a user question to either recommend or converse.
    Recommend for questions where the user is asking to generate styling recommendation. Use it when they are asking for styling ideas or outfits. 
    Converse for their general conversational questions or questions on these topics like is some dress combination a good idea etc or for a conversational question about the genereated recommendations list."""
    route_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "{question}"),
        ]
    )
    response = None
    question_router = route_prompt | structured_llm_router
    if question_router.invoke({"question": query}).datasource == "converse":
        response = reply_conversation(query, chat_history, user_id)
    else:
        response = generate_recommendation(query, chat_history, user_id)
    return response


chat_history = []


@app.post("/ask")
async def ask_question(query: str, prev_messages: int, new_chat: bool, user_id: str):
    try:
        with get_openai_callback() as cb:
            print(chat_history[-prev_messages:])
            if new_chat:
                chat_history.clear()
            response = answer_query(
                query, 
                chat_history[-prev_messages:],
                user_id
                )
            chat_history.append({"Human": query, "AI": response})
            print(cb)
            return {"response": response
                    }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=7000)
