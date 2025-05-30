import { useEffect } from 'react'

const Receiver = () => {
    let pc: RTCPeerConnection | null = null;
        useEffect(() => {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => {
                socket.send(JSON.stringify({type: "receiver"}))
            }
            socket.onmessage = async (e) => {
                const message = JSON.parse(e.data);
                if(message.type === "offer"){
                    pc = new RTCPeerConnection();
                    await pc.setRemoteDescription(message.offer)
                    pc.onicecandidate = (e) => {
                        if(e.candidate){
                        socket?.send(JSON.stringify({type: "addIceCandidate" , candidate: e.candidate}))
                        }
                    }
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer)
                    socket.send(JSON.stringify({type: "createAnswer" , answer: answer}))
                }else if(message.type === "iceCandidate"){
                    pc?.addIceCandidate(message.candidate)
                }
            }
        } , [])
  return (
    <div>Receiver</div>
  )
}

export default Receiver