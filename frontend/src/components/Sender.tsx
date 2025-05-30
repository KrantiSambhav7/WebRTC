import { useEffect, useState } from 'react'

const Sender = () => {
    const [socket , setSocket] = useState<null | WebSocket>(null);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({type: "socket"}))
        }
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
                socket.onmessage = (e) => {
                    const data = JSON.parse(e.data);
                    if(data.type === "createAnswer"){
                        pc.setRemoteDescription(data.sdp);
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