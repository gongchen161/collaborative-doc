import { useState, useEffect } from "react";
import Note from "./components/Note";
import Signup from './components/Signup';
import Login from './components/Login'
import Home from './components/Home'
import Loading from "./components/Loading";
import Profile from './components/Profile'
import { HashRouter, Switch, Redirect } from "react-router-dom"
import RouteWrapper from "./RouteWrapper";
import { AuthProvider } from './AuthContext';
function App() {


  return (
    <AuthProvider>
      <HashRouter>
        <Switch>
          <RouteWrapper exact path="/">
            <Redirect to={`/home`} />
          </RouteWrapper>
          <RouteWrapper exact path="/signup">
            <Signup />
          </RouteWrapper>
          <RouteWrapper exact path="/login">
            <Login />
          </RouteWrapper>
          <RouteWrapper exact path="/home">
            <Home />
          </RouteWrapper>
          <RouteWrapper exact path="/profile">
            <Profile />
          </RouteWrapper>
          <RouteWrapper path="/note/:noteId">
            <Note />
          </RouteWrapper>
        </Switch>
      </HashRouter>

    </AuthProvider>
  );
}

export default App;
