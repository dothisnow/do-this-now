import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import loginManager from './helpers/LoginManager'
import Home from './home'
import Login from './login'
import NewTask from './newtask'
import Tasks from './tasks'
import UpdateTask from './updatetask'

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
            <Route path='update-task/:id' element={<UpdateTask />} />
          </Route>
        </Routes>
      </Router>
      <button
        onClick={loginManager.signOut}
        type='button'
        className='fixed right-5 bottom-5 rounded border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white hover:border-gray-600 hover:bg-gray-700'>
        Log out
      </button>
    </div>
  )
}

export default App
