
import Recat, { useState, useEffect, useRef } from 'react'
import Document from "./components/Document";
import Signup from './components/Signup';
import uuid from 'react-uuid'

import { HashRouter, Switch, Route, Redirect } from "react-router-dom" 
import { AuthProvider } from './AuthContext';

function App() {
  const sessionId = uuid();


  return (
    <AuthProvider>
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${uuid()}`} />
        </Route>
        <Route path="/signup">
          <Signup 
          />
        </Route>
        <Route path="/:docId">
          <Document 
            sessionId={sessionId}
          />
          <div>v1.2</div>
        </Route>
      </Switch>
    </HashRouter>

  </AuthProvider>
  );
}

export default App;
