import type { NextPage } from 'next'
import { useEffect, useState,useRef } from 'react'
import { useSockets } from '../context/socket.context'
import RoomsContainer from '../containers/Rooms'
import MessagesContainer from '../containers/Messages'
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { socket ,username,setUsername} = useSockets()
  const usernameRef = useRef<HTMLInputElement | null>(null)

  const [socketId,setSocketId] = useState<string>('')
  useEffect(() => {
    setSocketId(socket.id)
  }, [socket])
  useEffect(() => { 
    if (usernameRef.current) {
      usernameRef.current.value = localStorage.getItem("username")
    }
   
  },[])
  const handleSetUsername = ():void => {
    const value = usernameRef.current?.value;

    if (!value) {
      return  
    }
    setUsername(value)
    localStorage.setItem("username",value)
   }
  return (
    <div >
      {!username && 
      <div className={styles.usernameWrapper}>
        <div className={styles.usernameInner}>
          <input placeholder='Username' ref={usernameRef}  />
          <button className="cta" onClick={handleSetUsername }>Start</button>
        </div>
      </div>
      }
      {
        username && (
        <div className={styles.container}>  
          <RoomsContainer />
          <MessagesContainer/>
        </div>
        )
      }

    </div>
  )
}

export default Home
