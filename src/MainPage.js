import SignInSide from './SignInSide';
import Dashboard from './Dashboard/Dashboard';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  Redirect
} from "react-router-dom";

export default function MainPage() {
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuth, setIsAuth] = useState(false);
  const [isBeforeRender, setIsBeforeRender] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState();

  const server = 'http://localhost:3001';

  useEffect(() =>{
    
    if(isBeforeRender){
      if(!isAuth){
        authorize();
      }else{
        setSelectedVehicleId(localStorage.getItem('selectedVehicleId'));
      }
    }

  });

  const authorize = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/auth`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((_isAuth) => {
        setIsAuth(_isAuth);
      })
      .then(()=>{
        setIsBeforeRender(false);
      })
      .catch((err) => {
        setIsBeforeRender(false);
        console.log(err);
      });
  };
  
  let mainPage = <div></div>;
  if(!isBeforeRender){
    if(!isAuth){
      mainPage = <SignInSide />
    }else{
      mainPage = <Dashboard />
    }
  }
  
  return(
    <div>
      {mainPage}
    </div>
    
  );
}