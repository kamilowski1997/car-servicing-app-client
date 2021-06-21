import './App.css';
import SignUp from './SignUp';
import MainPage from './MainPage'

import React from 'react';
import NotFoundPage from './404.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  Redirect
} from "react-router-dom";

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/signUp">
          <SignUp />
        </Route>
        <Route path="/404" >
          <NotFoundPage />
        </Route>
        <Redirect to='/404'  />
      </Switch>
    </Router>
  );
  
}

export default App;
