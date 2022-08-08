import { useCallback, useEffect, useState } from 'react'

const App = () => {
    const [lastKey, setLastKey] = useState(null)

    const handleKeyPress = useCallback((event) => setLastKey(event.key), [])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress)

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    return (
        <div className='h-screen flex flex-col justify-center bg-gray-100'>
            {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
            <div className='max-w-3xl mx-auto border py-auto p-6 rounded bg-white drop-shadow-sm'>
                <h2 className='font-bold'>Hi: {lastKey}</h2>
            </div>
        </div>
    )
}

export default App
