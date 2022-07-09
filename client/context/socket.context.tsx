import { createContext, useContext, useEffect, useState } from "react";
import { io , Socket} from "socket.io-client";
import { SOCKET_URL } from "../config/defaul"
import EVENTS from "../config/events";

interface IMessage {
  message: string;
  time: string;
  username: string;
}
interface IRoom {
  name: string;
}

interface Context {
  socket: Socket;
  username?: string;
  messages?: IMessage[];
  setUsername: Function;
  setMessages: Function;
  rooms: object;
  roomId?: string;
}

const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>({ socket, rooms: {}, setUsername: () => { }, setMessages: () => { }, messages:[] })



function SocketsProvider(props: any) {
  const [username,setUsername] = useState("")
  const [roomId,setRoomId] = useState("")
  const [rooms,setRooms] = useState({})
  const [messages, setMessages] = useState<IMessage[]>([])
  
  useEffect(() => {
    window.onfocus = function() {
      document.title = "Chat app"
    }
  },[])
  
  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value)
  })
  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value)
    setMessages([])
  })
  useEffect(() => {
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
      if (!document.hasFocus()) {
        document.title = "New message...";
      }

      setMessages((messages) => [...messages, { message, username, time }]);
    });
  }, [socket]);
  return <SocketContext.Provider value={{ socket,username,setUsername,rooms,messages,roomId,setMessages}} {...props} />;
}
export const useSockets = () => useContext(SocketContext)
export default SocketsProvider