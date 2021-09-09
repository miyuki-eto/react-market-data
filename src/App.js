// import logo from './logo.svg';
import './App.css';
import Main from "./components/structure/main";
import { BrowserRouter as Router } from 'react-router-dom'


function App() {
  return (
      <Router className="flex flex-col h-screen relative">
        <div className="flex flex-row bg-custom-bg text-white h-screen">
          <Main/>
        </div>
      </Router>
  );
}

export default App;
