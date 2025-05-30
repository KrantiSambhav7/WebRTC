"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null; // local copy to store the sockets locally 
let receiverSocket = null;
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        // identify-as-user
        if (message.type === "sender") {
            console.log("Sender set");
            senderSocket = ws;
            // identify-as-receiver
        }
        else if (message.type === "receiver") {
            console.log("Receiver set");
            receiverSocket = ws;
            // create offer
        }
        else if (message.type === "createOffer") {
            console.log("Offer made");
            if (ws != senderSocket)
                return;
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "offer", offer: message.sdp })); // Here the server is sending the offer to the receiver 
            // create answer
        }
        else if (message.type === "createAnswer") {
            console.log("Answer made");
            if (ws != receiverSocket)
                return;
            console.log(message.sdp);
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "answer", answer: message.sdp })); // Here the server is sending the answer to the sender
            // add ice candidtes
        }
        else if (message.type === "addIceCandidates") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "iceCcandidate", candidate: message.candidate }));
            }
            if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "iceCcandidate", candidate: message.candidate }));
            }
        }
    });
    ws.send("something");
});
