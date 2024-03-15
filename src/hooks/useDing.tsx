import useSound from 'use-sound'
import dingmp3 from '../soundeffects/ding.mp3'

const useDing = () => {
  const ding = useSound(typeof dingmp3 === 'string' ? dingmp3 : '', {
    volume: 1,
  })[0]
  return () => {
    // resume audio context
    const context = new AudioContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    ding()
  }
}

export default useDing
