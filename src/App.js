
import TextEditor from "./components/TextEditor";
import uuid from 'react-uuid'

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

function App() {
  const sessionId = uuid();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/collaborative-doc/${uuid()}`} />
        </Route>
        <Route exact path="/collaborative-doc">
          <Redirect to={`/collaborative-doc/${uuid()}`} />
        </Route>
        <Route path="/collaborative-doc/:docId">
          <TextEditor 
            sessionId={sessionId}
          />
          <div>v1.1</div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
