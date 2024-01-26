import useSound from 'use-sound'
import ding from '../soundeffects/ding.mp3'

const useDing = () =>
  useSound(typeof ding === 'string' ? ding : '', { volume: 1 })[0]

export default useDing
