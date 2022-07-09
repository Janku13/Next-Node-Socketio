import express ,{Request,Response} from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import config from 'config'
import cors from 'cors'
import socket from './socket'

import logger from './utils/logger'
import {version} from '../package.json'

const port = config.get<number>("port")
const host = config.get<string>("host")
const corsOrigin = config.get<string>("corsOrigin")

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials:true,
  }
})

app.get("/", (_:Request,res:Response) =>res.send(`Server is on port ${port} and version ${version}`))

httpServer.listen(port, host, () => {
  logger.info(`server in listening version ${version}`);
  logger.info(`server in on http://${host}:${port}`);
  socket({io})
  
})