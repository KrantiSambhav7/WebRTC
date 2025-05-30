import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({port: 8080});

let senderSocket: null | WebSocket = null; // local copy to store the sockets locally 
let receiverSocket: null | WebSocket = null;

wss.on("connection" , (ws) => {
    ws.on("error" , console.error);
    ws.on("message" , (data: any) => {
        const message = JSON.parse(data);
        console.log(message);
        if(message.type === "identify-as-sender"){
            senderSocket = ws;
        }else if(message.type === "identify-as-receiver"){
            receiverSocket = ws;
        }else if(message.type === "create-offer"){
            receiverSocket?.send(JSON.stringify({type: "offer" , offer: message.offer}))
        }
    })
    // identify-as-user
    // identify-as-receiver
    // create offer
    // create answer
    // add ice candidates 
    // These are the 5 messages that we need to support for the ws
    
    ws.send("something");
});

