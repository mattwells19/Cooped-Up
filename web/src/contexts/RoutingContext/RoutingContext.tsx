import get from "@utils/get";
import * as React from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

interface IRoutingContext {
  newRoom: boolean;
  invalidRoomCode: boolean;
  roomCode: string | null;
  setIsNewRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInvalidRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoutingContext = React.createContext<IRoutingContext | null>(null);

const RoutingContextProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const { search } = useLocation();
  const match = useRouteMatch<{ roomCode: string }>("/room/:roomCode");

  const roomCode = React.useMemo<string | null>(() => {
    const slugRoomCode = match?.params.roomCode;
    const queryRoomCode = search ? new URLSearchParams(search).get("roomCode") : null;
    return slugRoomCode ?? queryRoomCode;
  }, [match, search]);


  const [newRoom, setNewRoom] = React.useState<boolean>(false);
  const [invalidRoom, setInvalidRoom] = React.useState<boolean>(false);

  
  React.useEffect(() => {
    async function doesRoomExist(roomCodeToCheck: string) {
      const validRoom = await get<boolean>(`checkRoom?roomCode=${roomCodeToCheck}`);
      
      if (!validRoom) {
        setInvalidRoom(true);
        history.push("/");
      }
    }

    if (!newRoom && roomCode) doesRoomExist(roomCode);
  }, []);

  return (
    <RoutingContext.Provider
      value={{
        invalidRoomCode: invalidRoom,
        newRoom,
        roomCode,
        setIsInvalidRoom: setInvalidRoom,
        setIsNewRoom: setNewRoom,
      }}
    >
      {children}
    </RoutingContext.Provider>
  );
};

const useRoutingContext = (): IRoutingContext => {
  const context = React.useContext(RoutingContext);
  if (context) {
    return context;
  } else {
    throw new Error("Used routing context outside of provider.");
  }
};

export { RoutingContextProvider, useRoutingContext };