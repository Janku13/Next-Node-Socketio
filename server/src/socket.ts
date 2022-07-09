import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid';
import logger from './utils/logger'

const EVENTS = {
  connection:"connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM:"JOIN_ROOM"
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE:"ROOM_MESSAGE"
  }
}
type Room = {name:string}
const rooms: Record<string, Room>  = {}
function socket({ io }: { io: Server }) {
  logger.info(`sockets enabled`)

  
  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`)
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      logger.info(roomName)
      const roomId = uuidv4()
      rooms[roomId] = {
        name: roomName
      }

      socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);   
      
    });

    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {

      const date = new Date();
      socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
        message,
        username,
        time:`${date.getHours()}:${date.getMinutes()}`
      })
    })

    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM,roomId)
    })
  })
}

export default socket