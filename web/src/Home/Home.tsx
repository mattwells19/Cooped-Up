import * as React from "react";
import "./Home.css";
import { Link, useHistory } from "react-router-dom";

const Home: React.FC = (props) => {
  const history = useHistory();

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomCode: string = e.currentTarget.roomCode.value;
    if (roomCode.trim().length === 0) return;
    console.log(`/room/${roomCode}`);
    history.push(`/room/${roomCode}`);
  }

  return (
    <div className="App">
      <form onSubmit={handleJoinRoom}>
        <label htmlFor="room-code">
          Room Code
          <input id="room-code" name="roomCode" type="text" />
        </label>
        <button className="primary" type="submit">Join Room</button>
      </form>
      <hr />
      <div>
        <button className="secondary">
          <Link to="/room/new">
            Start a New Room
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
