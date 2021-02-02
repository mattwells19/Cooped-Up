import React from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Lobby.css";
import Game from "../Game/Game";

const Lobby: React.FC = (props) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const socket = io("http://localhost:4000", { auth: { roomCode } });

  const [gameStarted, setGameStarted] = React.useState<boolean>(false);
  const [msg, setMsg] = React.useState<string>("");
  const [draft, setDraft] = React.useState<string>("");

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    socket.on("new_message", (data: string) => {
      setMsg(data);
    });

    // perform cleanup of socket when component derenders
    return () => { socket.off(); };
  }, []);

  function handleSend(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    socket.emit("message", draft);
    setDraft("");
  }

  const players = ["Matt", "Sam", "May"];

  return (
    <>
      <header>
        <h1>{roomCode}</h1>
      </header>
      <main>
        {!gameStarted && (
          <section>
            <h2>Players in lobby</h2>
            <hr />
            {players.map((player) => (
              <p key={player}>{player}</p>
            ))}
            <button className="primary" type="button" onClick={() => setGameStarted(true)}>
              Start Game
            </button>
          </section>
        )}
        {gameStarted && <Game socket={socket} />}
      </main>
    </>
  );
};

export default Lobby;
