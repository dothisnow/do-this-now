import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Redirect, Route, Switch } from 'wouter'
import { Button } from './components/button'
import { handleSignOut } from './helpers/auth'
import History from './history'
import Home from './home'
import Login from './login'
import NewTask from './newtask'
import Tasks from './tasks'
import UpdateTask from './updatetask'

const App = () => {
  return (
    <div className='w-100vw h-100vh bg-black'>
      <Switch>
        <Route path='/'>
          <Home />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/new-task'>
          <NewTask />
        </Route>
        <Route path='/tasks'>
          <Tasks />
        </Route>
        <Route path='/update-task/:id'>
          <UpdateTask />
        </Route>
        <Route path='/history'>
          <History />
        </Route>
        <Route>
          <Redirect to='/' />
        </Route>
      </Switch>
      <div className='fixed left-5 bottom-5 w-24 overflow-hidden overflow-ellipsis text-xs text-gray-700'>
        {import.meta.env.VITE_COMMIT_ID}
      </div>
      <div className='fixed right-5 bottom-5'>
        <Button
          icon={faRightFromBracket}
          onClick={handleSignOut}
          text='Log out'
        />
      </div>
    </div>
  )
}

export default App
