
import TextEditor from "./components/TextEditor";
import uuid from 'react-uuid'

function App() {
  const sessionId = uuid();

  return (
    <TextEditor 
      sessionId={sessionId}
    />
  );
}

export default App;
