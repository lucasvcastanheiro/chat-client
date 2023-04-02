const ws = new WebSocket('ws://localhost:3000')
const commands: { [index: string]: Function } = {}

ws.onopen = () => {
    console.log('Ws conectado')
    addCommand('conexao', persistConnectionOnLocalStorage)
}

ws.onmessage = (message: MessageEvent) => {
    const {cmd, data}: {cmd: string, data: object} = JSON.parse(message.data)

    if(!cmd) {
        return
    }

    try {
        commands[cmd](data)
    } catch (error) {
        console.log(`Comando '${cmd}' não cadastrado.`);
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

    
}

export {addCommand, sendWs}