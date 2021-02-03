import * as React from "react";
import "./Home.css";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
  const history = useHistory();
  const inputRef = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    // focus input on render
    inputRef.current?.focus();
  }, []);

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomCode: string = e.currentTarget.roomCode.value;
    if (roomCode.trim().length === 0) return;
    history.push(`/room/${roomCode}`);
  }

  function handleNewRoom() {
    // TODO: generate new room code
    const roomCode = "new";
    history.push(`/room/${roomCode}`);
  }

  return (
    <>
      <header>
        <h1>Coup</h1>
      </header>
      <div className="App">
        <form onSubmit={handleJoinRoom}>
          <label htmlFor="room-code">
            Enter Room Code
            <input ref={inputRef} id="room-code" maxLength={4} name="roomCode" type="text" />
          </label>
          <button className="primary" type="submit">Join Room</button>
        </form>
        <hr />
        <div>
          <button onClick={handleNewRoom} className="secondary">
            Start a New Room
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
