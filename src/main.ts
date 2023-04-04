import './style.css'
import {addCommand, sendWs} from './websocket'
const messages = document.querySelector<HTMLDivElement>('#messages')
const inputMessage = document.querySelector<HTMLInputElement>('#input-message')
const template = document.querySelector('template')

Notification.requestPermission().then((permission) => { 
  console.log('permiss', permission)
});

Notification.requestPermission();

const {id} = JSON.parse(localStorage.getItem('user')!)

inputMessage!.onkeydown = (ev) => {
  const {code} = ev

  if(code === "Enter") {
    sendNewMessage()
  }
}

const sendNewMessage = () => {
  const message = inputMessage!.value

  inputMessage!.value = ""

  sendWs('newMessage', {message, id})
}

addCommand('newMessage', (data: any) => {
  const {message, userId}: {message: string, userId: string} = data

  const messageBox = template?.content.cloneNode(true) as HTMLDivElement
  
  const messageDiv = messageBox.querySelector<HTMLDivElement>('.message-box')!

  messageDiv.innerText = message
  
  if(messages){
    const messageType = userId === id ? 'own-message' : 'other-message'
      
    messageDiv.classList.add(messageType)

    messages.appendChild(messageBox)

    messages!.scrollTop = messages!.scrollHeight;

    if(document.hasFocus()) {
      return
    }

    if (Notification.permission === "granted") {      
      showNotification(message)
    } else if (Notification.permission === 'denied') {
      Notification.requestPermission().then(permission => {
        showNotification(message)
      })
    }
  }
})

const showNotification = (message: string) => {
  const notification = new Notification("Chegou uma nova mensagem.", {
    body: message
  })

  notification.onclick = (e) => {
    window.focus()
  }
}
