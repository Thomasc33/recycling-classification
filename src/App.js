import {
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import './App.css';
import HomePage from './Pages/Home'
import AboutPage from './Pages/About'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/about" render={props => <AboutPage {...props} />} />
        <Route exact path="/" render={props => <HomePage {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
