import React from "../../_snowpack/pkg/react.js";
import {io} from "../../_snowpack/pkg/socket.io-client.js";
import {useParams} from "../../_snowpack/pkg/react-router-dom.js";
import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Input,
  Text,
  VStack
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import Header from "../components/Header.js";
import useDocTitle from "../hooks/useDocTitle.js";
const Lobby = () => {
  const {roomCode} = useParams();
  useDocTitle(`Lobby - ${roomCode}`);
  const socket = React.useMemo(() => io("/", {
    auth: {roomCode},
    autoConnect: false,
    reconnectionAttempts: 5
  }), [roomCode]);
  const [messages, setMessages] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  React.useEffect(() => {
    socket.connect();
    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off();
    };
  }, []);
  function handleSend(e) {
    e.preventDefault();
    socket.emit("message", draft.trim());
    setDraft("");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Header, null, roomCode), /* @__PURE__ */ React.createElement(Center, {
    marginTop: "10"
  }, /* @__PURE__ */ React.createElement(VStack, {
    alignItems: "flex-start"
  }, /* @__PURE__ */ React.createElement(Heading, {
    as: "h2"
  }, "Chat"), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(VStack, {
    height: "20rem",
    alignItems: "flex-start",
    overflowY: "auto",
    width: "100%"
  }, messages.map((message, i) => /* @__PURE__ */ React.createElement(Text, {
    key: `${message}${i}`
  }, message))), /* @__PURE__ */ React.createElement(HStack, {
    as: "form",
    onSubmit: handleSend
  }, /* @__PURE__ */ React.createElement(Input, {
    autoFocus: true,
    onChange: (e) => setDraft(e.target.value),
    value: draft
  }), /* @__PURE__ */ React.createElement(Button, {
    disabled: draft.trim().length === 0,
    type: "submit"
  }, "Send")))));
};
export default Lobby;
