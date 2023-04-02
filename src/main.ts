import './style.css'
import {addCommand, sendWs} from './websocket'

const inputMessage = document.querySelector<HTMLInputElement>('#inputMessage')

inputMessage!.onkeydown = (ev) => {
  const {code} = ev

  if(code === "Enter") {
    sendWs('newMessage', {message: inputMessage!.value})
  }
}
