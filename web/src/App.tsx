import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

interface AppProps {}

const App: React.FC<AppProps> = (props) => {
  const [msg,setMsg] = React.useState<string>("");
  const [draft,setDraft] = React.useState<string>("");

  // put socket listeners in useEffect so it only registers on render
  useEffect(() => {
    socket.on("new_message", (data: string) => {
      setMsg(data);
    });

    // perform cleanup of socket when component derenders
    return () => { socket.off() };
  }, []);

  function handleSend(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    socket.emit("message", draft);
    setDraft("");
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{msg}</p>
        <form onSubmit={handleSend} method="POST">
          <label htmlFor="message">Type your message and hit submit</label>
          <input id="message" onChange={(e) => setDraft(e.target.value)} value={draft} type="text"/>
          <button type="submit">Submit</button>
        </form>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
