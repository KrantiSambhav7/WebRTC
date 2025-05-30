import { useEffect } from 'react'

const Receiver = () => {
        useEffect(() => {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => {
                socket.send(JSON.stringify({type: "receiver"}))
            }
            socket.onmessage = async (e) => {
                const message = JSON.parse(e.data);
                if(message.type === "offer"){
                    console.log("Inside receiver")
                    const pc = new RTCPeerConnection();
                    await pc.setRemoteDescription(message.offer)
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer)
                    socket.send(JSON.stringify({type: "createAnswer" , answer: answer}))
                }
            }
        } , [])
  return (
    <div>Receiver</div>
  )
}

export default Receiver