import { useEffect } from 'react'

const Receiver = () => {
        useEffect(() => {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => {
                socket.send(JSON.stringify({type: "receiver"}))
            }
            socket.onmessage = async (e) => {
                const message = JSON.parse(e.data);
                if(message.type === "createOffer"){
                    const pc = new RTCPeerConnection();
                    const answer = await pc.createAnswer();
                    pc.setRemoteDescription(message.sdp)
                    await pc.setLocalDescription(answer)
                    socket.send(JSON.stringify({type: "createAnswer" , sdp: answer}))
                }
            }
        } , [])
  return (
    <div>Receiver</div>
  )
}

export default Receiver