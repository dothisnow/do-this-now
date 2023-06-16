import { CubeTransparentIcon } from '@heroicons/react/20/solid'

const Loading = ({ light = true }) => (
  <CubeTransparentIcon
    className={
      (light ? 'text-gray-600' : 'text-gray-200') +
      ' mx-auto h-10 w-10 animate-pulse'
    }
  />
)

export default Loading
