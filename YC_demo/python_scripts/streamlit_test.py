import streamlit as st
import os
from openai import OpenAI

# Load your OpenAI API key 
client = OpenAI(
    api_key=""
)

# Streamlit interface elements
st.title("Chat with AI")

# Chat display container (for scrolling)
chat_container = st.container()

# Maintain conversation history
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

def generate_response(user_input):
    # Update chat history
    st.session_state['chat_history'].append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=st.session_state['chat_history']
    )

    ai_response = response.choices[0].message.content
    st.session_state['chat_history'].append({"role": "assistant", "content": ai_response})
    return ai_response

def display_chat():
    with chat_container:  # Place the chat history within the container
        try: 
            for entry in st.session_state['chat_history'][-2:]:
                print(entry['role'])
                if entry['role'] == 'user':
                    st.write("You: ", entry['content'])
                else:
                    st.write("AI: ", entry['content'])  
        except: 
            for entry in st.session_state['chat_history']:
                print(entry['role'])
                if entry['role'] == 'user':
                    st.write("You: ", entry['content'])
                else:
                    st.write("AI: ", entry['content'])

# Display the chat history (initially)
display_chat()

# Get new user input
user_input = st.text_input("You: ", key="user_input")

# Generate and display response if there's new input
if user_input:
    with st.spinner("AI is thinking..."):
        ai_response = generate_response(user_input)
    display_chat()  # Update the displayed chat history