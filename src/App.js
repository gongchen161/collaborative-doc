
import Note from "./components/Note";
import Signup from './components/Signup';
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import { AuthProvider } from './AuthContext';

function App() {

  return (
    <AuthProvider>
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to={`/home`} />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="/note/:noteId">
            <Note />
          </Route>
        </Switch>
      </HashRouter>

    </AuthProvider>
  );
}

export default App;
