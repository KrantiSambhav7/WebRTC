import { useEffect, useState } from 'react'

const Sender = () => {
    const [socket , setSocket] = useState<null | WebSocket>(null);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({type: "sender"}))
        }
        setSocket(socket);
    } , [])
  return (
    <div>
        <button onClick={() => {
            async function webSender(){
            //Create an offer 
            const pc = new RTCPeerConnection();
            pc.onnegotiationneeded = async () => {
                const offer = await pc.createOffer(); // SDP
                await pc.setLocalDescription(offer);
                socket?.send(JSON.stringify({type: "createOffer" , sdp: offer}))
            }
            pc.onicecandidate = (e) => {
                if(e.candidate){
                    socket?.send(JSON.stringify({type: "addIceCandidate" , candidate: e.candidate}))
                }
            }
            if (socket) {
                socket.onmessage = async (e) => {
                    const message = JSON.parse(e.data);
                    if(message.type === "answer"){
                        await pc.setRemoteDescription(message.answer);
                    }else if(message.type === "iceCandidate"){
                        pc.addIceCandidate(message.candidate)
                    }
                };
            }
            }
            webSender();
        }}>Send message</button>
    </div>
  )
}

export default Sender