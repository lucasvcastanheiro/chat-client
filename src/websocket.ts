const ws = new WebSocket('ws://localhost:3000')
const commands: Record<string, Function> = {}

ws.onopen = () => {
    console.log('Ws conectado')

    const savedUser = localStorage.getItem('user')
    
    const {id} = JSON.parse(savedUser!) || {}

    sendWs('authentication', {id})

    addCommand('connection', persistConnectionOnLocalStorage)
    addCommand('error', errorHandler)
}

ws.onmessage = (message: MessageEvent) => {
    const {cmd, data}: {cmd: string, data: object} = JSON.parse(message.data)

    if(!cmd) {
        return
    }

    try {
        commands[cmd](data)
    } catch (error) {
        console.log(`Command '${cmd}' is not cadastred.`);
    }
}

const addCommand = (cmd: string, action: Function) => {
    commands[cmd] = action
}

const sendWs = (cmd: string, data: object) => {
    ws.send(JSON.stringify({cmd, data}))
}

const persistConnectionOnLocalStorage = (data: any) => {
    const {id}: {id: string} = data

    const user = localStorage.getItem('user')

    if(!user){
        localStorage.setItem('user', JSON.stringify({id}));
    }
}

const errorHandler = (data: any) => {
    const {error}: {error: string} = data

    window.alert(error)
}

export {addCommand, sendWs}
