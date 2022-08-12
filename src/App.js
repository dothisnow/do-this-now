import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import loginManager from './helpers/LoginManager'

import Home from './home'
import Login from './login'
import NewTask from './newtask'
import Tasks from './tasks'

const App = () => {
    return (
        <div className='w-100vw h-100vh bg-gray-900'>
            <Router>
                <Routes>
                    <Route path='/'>
                        <Route index element={<Home />} />
                        <Route path='login' element={<Login />} />
                        <Route path='new-task' element={<NewTask />} />
                        <Route path='tasks' element={<Tasks />} />
                    </Route>
                </Routes>
            </Router>
            <button
                onClick={loginManager.signOut}
                type='button'
                className='md:hidden absolute right-5 bottom-5 px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-gray-800 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Log out
            </button>
        </div>
    )
}

export default App
