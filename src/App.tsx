import { Redirect, Route, Switch } from 'wouter'
import loginManager from './helpers/LoginManager'
import History from './history'
import Home from './home'
import Login from './login'
import NewTask from './newtask'
import Tasks from './tasks'
import UpdateTask from './updatetask'

const App = () => {
  return (
    <div className='w-100vw h-100vh bg-gray-900'>
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
      <button
        onClick={loginManager.signOut}
        type='button'
        className='fixed right-5 bottom-5 rounded border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white outline-none ring-white ring-offset-2 ring-offset-black hover:border-gray-600 hover:bg-gray-700 focus:z-10 focus:ring'>
        Log out
      </button>
    </div>
  )
}

export default App
