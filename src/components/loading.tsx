import { faCube } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Loading = () => (
  <FontAwesomeIcon
    icon={faCube}
    className='mx-auto h-5 w-5 animate-pulse text-gray-300'
  />
)
