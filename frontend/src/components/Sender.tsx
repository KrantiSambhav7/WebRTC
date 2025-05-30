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
            const offer = await pc.createOffer(); // SDP
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({type: "createOffer" , sdp: offer}))
            if (socket) {
                socket.onmessage = async (e) => {
                    const message = JSON.parse(e.data);
                    if(message.type === "answer"){
                        await pc.setRemoteDescription(message.answer);
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