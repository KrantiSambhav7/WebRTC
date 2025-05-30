import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({port: 8080});

let senderSocket: null | WebSocket = null; // local copy to store the sockets locally 
let receiverSocket: null | WebSocket = null;

wss.on("connection" , (ws) => {
    ws.on("error" , console.error);
    ws.on("message" , (data: any) => {
        const message = JSON.parse(data);
            // identify-as-user
        if(message.type === "sender"){
            console.log("Sender set")
            senderSocket = ws;
            // identify-as-receiver
        }else if(message.type === "receiver"){
            console.log("Receiver set")
            receiverSocket = ws;
            // create offer
        }else if(message.type === "createOffer"){
            console.log("Offer made")
            if(ws != senderSocket) return;
            receiverSocket?.send(JSON.stringify({type: "offer" , offer: message.sdp})) // Here the server is sending the offer to the receiver 
         // create answer
        }else if(message.type === "createAnswer"){
            console.log("Answer made")
            if(ws != receiverSocket) return;
            console.log(message.answer)
            senderSocket?.send(JSON.stringify({type: "answer" , answer: message.answer})) // Here the server is sending the answer to the sender
        // add ice candidtes
        }else if(message.type === "addIceCandidates"){
            if(ws === senderSocket){
                receiverSocket?.send(JSON.stringify({type: "iceCcandidate" , candidate: message.candidate}))
            }
            if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify({type: "iceCcandidate" , candidate: message.candidate}))
            }
        }
    })
    ws.send("something");
});

