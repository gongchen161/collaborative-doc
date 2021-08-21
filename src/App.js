
import TextEditor from "./components/TextEditor";
import uuid from 'react-uuid'

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

function App() {
  const sessionId = uuid();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${uuid()}`} />
        </Route>
        <Route path="/:docId">
          <TextEditor 
            sessionId={sessionId}
          />
          <div>v1.0</div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
