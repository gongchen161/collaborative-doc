
import TextEditor from "./components/TextEditor";
import uuid from 'react-uuid'

import { HashRouter, Switch, Route, Redirect } from "react-router-dom"

function App() {
  const sessionId = uuid();

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${uuid()}`} />
        </Route>
        <Route path="/:docId">
          <TextEditor 
            sessionId={sessionId}
          />
          <div>v1.2</div>
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
