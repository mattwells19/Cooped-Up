import * as React from "../../_snowpack/pkg/react.js";
import {useHistory} from "../../_snowpack/pkg/react-router-dom.js";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Collapse,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import Header from "../components/Header.js";
import useDocTitle from "../hooks/useDocTitle.js";
const Home = () => {
  const history = useHistory();
  useDocTitle("Home");
  const [error, setError] = React.useState(false);
  async function handleJoinRoom(roomCode) {
    const validRoom = await fetch(`/api/checkRoom?roomCode=${roomCode}`, {method: "GET"}).then((data) => data.json()).catch((err) => {
      throw Error(err);
    });
    if (validRoom)
      history.push(`/room/${roomCode.toUpperCase()}`);
    else
      setError(true);
  }
  function handleRoomCodeChange(code) {
    if (error && code.length !== 4)
      setError(false);
    else if (code.length === 4)
      handleJoinRoom(code);
  }
  function handleNewRoom() {
    const roomCode = "NEW";
    history.push(`/room/${roomCode}`);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Header, null, "Cooped Up"), /* @__PURE__ */ React.createElement(Center, {
    margin: "auto",
    marginTop: "10",
    maxWidth: "lg"
  }, /* @__PURE__ */ React.createElement(VStack, {
    spacing: 10
  }, /* @__PURE__ */ React.createElement(Text, {
    paddingX: "4",
    fontSize: "large"
  }, "So you're all cooped up at home with nothing to do. You want to hang out with friends, but you can't because the virus is still at large. What better way to connect with your friends than with a little bit of deception!\xA0", /* @__PURE__ */ React.createElement(Text, {
    fontWeight: "bold",
    as: "span"
  }, "Cooped Up"), "\xA0is based on the popular card game Coup."), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(VStack, {
    spacing: 4
  }, /* @__PURE__ */ React.createElement(Text, null, "Already have a room code? Type/paste it here."), /* @__PURE__ */ React.createElement(HStack, null, /* @__PURE__ */ React.createElement(PinInput, {
    autoFocus: true,
    onChange: handleRoomCodeChange,
    isInvalid: error,
    size: "lg",
    type: "alphanumeric"
  }, /* @__PURE__ */ React.createElement(PinInputField, null), /* @__PURE__ */ React.createElement(PinInputField, null), /* @__PURE__ */ React.createElement(PinInputField, null), /* @__PURE__ */ React.createElement(PinInputField, null))), /* @__PURE__ */ React.createElement(Collapse, {
    in: error,
    animateOpacity: true
  }, /* @__PURE__ */ React.createElement(Alert, {
    status: "warning",
    width: "sm"
  }, /* @__PURE__ */ React.createElement(AlertIcon, null), "There is no room with that room code. Try a different code or start a new room."))), /* @__PURE__ */ React.createElement(HStack, {
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Text, null, "or"), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Button, {
    onClick: handleNewRoom,
    size: "lg"
  }, "Start a New Room"))));
};
export default Home;
