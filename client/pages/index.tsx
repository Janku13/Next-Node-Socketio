import type { NextPage } from 'next'
import { useSockets } from '../context/socket.context'

const Home: NextPage = () => {
  const { socket } = useSockets()
  return (
    <div>{socket.id}</div>
  )
}

export default Home
