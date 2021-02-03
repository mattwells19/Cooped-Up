import React from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Lobby.css";

const Lobby: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const socket = io("http://localhost:4000", { auth: { roomCode } });

  const [messages, setMessages] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState<string>("");

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    socket.on("new_message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    // perform cleanup of socket when component is removed from the DOM
    return () => { socket.off(); };
  }, []);

  function handleSend(): void {
    socket.emit("message", draft);
    setDraft("");
  }

  return (
    <>
      <header>
        <h1>{roomCode}</h1>
      </header>
      <main>
        <section>
          <h2>Chat</h2>
          <hr />
          {messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
          <input onChange={(e) => setDraft(e.target.value)} value={draft} />
          <button onClick={handleSend}>Send</button>
        </section>
      </main>
    </>
  );
};

export default Lobby;
