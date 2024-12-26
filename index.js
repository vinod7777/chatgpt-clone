const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector('.chat-container');
const themeButton = document.querySelector('#theme-btn');
const deleteButton = document.querySelector('#delete-btn');

let userText =null;
const API_KEY='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';
const initialHeight = chatInput.scrollHeight;

const localDataFromLOcalStorage = () => {
    const themeColor = localStorage.getItem('theme-color');

    document.body.classList.toggle('light-mode',themeColor === 'light_mode');
    themeButton.innerText = document.body.classList.contains('light-mode') ? 'dark_mode' : 'light_mode';

const  defualtChat = `<div class="defual-text">
        <img src="./images/chatbot.jpg" alt="">
        <h1>ChatGpt</h1>
    <p>Hi, I am a chatbot. How can I help you?</p>
    </div>`;

    chatContainer.innerHTML = localStorage.getItem('chat') || defualtChat;
    chatContainer.scrollTo(0,chatContainer.scrollHeight);

}

localDataFromLOcalStorage();
const createElement = (html,className) => {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat',className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL= "https://api.openai.com/v1/completions";
    const pEelement= document.createElement('p');
    const requestOption = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
    "prompt": userText,
    "max_tokens": 2048,
    "temperature": 0.2,
    "n": 1,
    "stop":null
        }),
    }
    try{

        const response = await(await fetch(API_URL,requestOption)).json();
        pEelement.textContent = response.choices[0].text; 
    }catch(error){
        pEelement.classList.add('error');
        pEelement.textContent = "Sorry, I am unable to process your request. Please try again later.";
    }
    incomingChatDiv.querySelector('.typing-animation').remove();
    incomingChatDiv.querySelector('.chat-details').appendChild(pEelement);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);

    localStorage.setItem('chat',chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector('p');
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy",1000);
}

const showTypingAnimation = () => {
    const html =`<div class="chat incoming">
        <div class="chat-content">
            <div class="chat-details">
                <img src="./images/chatbot.jpg" alt="">
                <div class="typing-animation">
                    <div class="typing-dot" style="--delay:0.2s"></div>
                    <div class="typing-dot" style="--delay:0.3s"></div>
                    <div class="typing-dot" style="--delay:0.4s"></div>
                </div>
            </div>
            <span onclick="copyResponse(this)" class="material-symbols-outlined">
                content_copy
                </span>
        </div>`;
    const incomingChatDiv = createElement(html,"incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);

    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;
    chatInput.value = '';
    chatInput.style.height = `${initialHeight}px`;

    const html =`<div class="chat outgoing">
            <div class="chat-content">
                <div class="chat-details">
                    <img src="./images/user.jpg" alt="">
                    <p></p>
                </div>
            </div>
        </div>`;
    const outgoingChatDiv = createElement(html,"outgoing");
    outgoingChatDiv.querySelector('p').textContent = userText;
    document.querySelector('.defual-text')?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    setTimeout(showTypingAnimation,500);
}

themeButton.addEventListener('click',() => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme-color',themeButton.innerText);
    themeButton.innerText = document.body.classList.contains('light-mode') ? 'dark_mode' : 'light_mode';
});

deleteButton.addEventListener('click',() => {
    if (confirm('Are you sure you want to delete the chat?')) {
        chatContainer.innerHTML = '';
        localStorage.removeItem('chat');
        localDataFromLOcalStorage();
    }
});

chatInput.addEventListener('input',() => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener('keydown',(event) => {
    if(event.key === 'Enter' && !event.shiftKey && window.innerWidth > 800){
        event.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener('click',handleOutgoingChat);