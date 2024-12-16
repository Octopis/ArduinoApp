import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/**
 * Establish a new WebSocket connection.
 */
const ws = new WebSocket(`ws://localhost:8080/online-status`);

/**
 * When a WebSocket connection is open, inform the server that a new user is online.
 */
ws.onopen = function () {
  ws.send("hello from react");
};

function App() {
   const [count, setCount] = useState(0)
  
   useEffect(() => {
    /**
     * Listen to messages and change the users' online count.
     */
    ws.onmessage = message => {
      console.log("message from server:", message.data);
    };
  }, []);

  useEffect(() => {
    /**
     * Listen to messages and change the users online count.
     */
    ws.onmessage = message => {
      const data = JSON.parse(message.data);
      setCount(data.numberButtonPush);
      console.log("websocket button push +1")
    };
  }, []);
 

  function switchOnLight(){
    fetch("http://192.168.231.88/H")
  }

  function switchOffLight(){
    fetch("http://192.168.231.88/L")
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div style={{display: "flex", gap: 10}}>
          <button onClick={() => switchOnLight()}>
            Allumer la led
          </button>
          <button onClick={()=> switchOffLight()}>
            Eteindre la led
          </button>
        </div>

        <div style={{marginTop: 22}}>number button push: {count}</div>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
