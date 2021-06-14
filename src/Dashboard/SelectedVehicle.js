import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function SelectedVehicle(props) {
  const classes = useStyles();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedVehicle, setSelectedVehicle] = useState(false);

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!selectedVehicle){
      getVehicle();
    }else{
      if(props.selectedVehicleId != selectedVehicle.id){
        getVehicle();
      }
    }
  });

  const getVehicle = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getVehicle`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
        selectedVehicleId: props.selectedVehicleId,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((vehicles) => {
        setSelectedVehicle(vehicles[0]);
        console.log(vehicles[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <React.Fragment>
      <Title>Selected Vehicle</Title>
      {selectedVehicle?<div>
      <Typography component="p" variant="h4">
        {selectedVehicle.name}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        id: {selectedVehicle.id}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        mileage: {selectedVehicle.mileage}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        brand: {selectedVehicle.brand}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        model: {selectedVehicle.model}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        production_date: {selectedVehicle.production_date}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        vin: {selectedVehicle.vin}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        color: {selectedVehicle.color}
      </Typography>
      </div>:<div></div>}
      {/*
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
      */}
    </React.Fragment>
  );
}
