import { useState } from 'react';
import './App.css';
import ChipsInput from './components/ChipsInput/ChipsInput';

function App() {

  const [value, setValue] = useState('');
  return (
    <div className="App">
      <ChipsInput value={value} onChange={setValue}/>
    </div>
  );
}

export default App;
