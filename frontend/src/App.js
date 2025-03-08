import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './components/Home';
import Form from './components/Form';
import ChangeTheme from './components/ChangeTheme';

function App() {
  return (
    <>
    <Router>
      {/* <ChangeTheme/> */}
      <Routes>
        {/* <Route path='/' element={<Home/>}/> */}
        <Route path='/' element={<Form/>}/>
      </Routes>
      </Router>
    </>
  );
}

export default App;
