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
            //Create an offer 
            
        }}>Send message</button>
    </div>
  )
}

export default Sender