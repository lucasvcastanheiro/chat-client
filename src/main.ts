import './style.css'
import {addCommand, sendWs} from './websocket'
const messagesContainer = document.querySelector<HTMLDivElement>('#messages')
const inputMessage = document.querySelector<HTMLInputElement>('#input-message')
const template = document.querySelector('template')

Notification.requestPermission().then((permission) => { 
  console.log('permiss', permission)
});

const {id} = JSON.parse(localStorage.getItem('user')!)

inputMessage!.onkeydown = (ev) => {
  const {code} = ev

  if(code === "Enter") {
    sendNewMessage()
  }
}

const sendNewMessage = () => {
  const message = inputMessage!.value

  if(!message || message.length == 0){
    return
  }

  inputMessage!.value = ""

  sendWs('newMessage', {message, id})
}

addCommand('newMessage', (data: any) => {
  const {message, userId}: {message: string, userId: string} = data

  addNewMessage(message, userId)
})

const showNotification = (message: string) => {
  const notification = new Notification("Chegou uma nova mensagem.", {
    body: message
  })

  notification.onclick = (_e) => {
    window.focus()
  }
}

const sendNotification = (message: string) => {
  if (Notification.permission === "granted") {      
    showNotification(message)
  } else if (Notification.permission === 'denied') {
    Notification.requestPermission().then(permission => {
      if(permission === 'granted'){
        showNotification(message)
      }
    })
  }
}

const addNewMessage = (message: string, userId: string) => {
  const messageBox = template?.content.cloneNode(true) as HTMLDivElement
  
  const messageDiv = messageBox.querySelector<HTMLDivElement>('.message-box')!

  messageDiv.innerText = message
  
  if(messagesContainer){
    const messageType = userId === id ? 'own-message' : 'other-message'
      
    messageDiv.classList.add(messageType)

    messagesContainer.appendChild(messageBox)

    messagesContainer!.scrollTop = messagesContainer!.scrollHeight;

    if(document.hasFocus()) {
      return
    }

    sendNotification(message)
  }
}

addCommand('getAllMessages', (data: any) => {
  const {messages}: {messages: {message: string, userId: string}[]}= data

  messages.forEach(messageObj => {
    const {message, userId} = messageObj
    addNewMessage(message, userId)
  })
})