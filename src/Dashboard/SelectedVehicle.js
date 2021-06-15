import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import moment from "moment";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
  const [isEditing, setIsEditing] = useState(false);
//editing vehicle
  const [selectedProductionDate, setSelectedProductionDate] = useState(null);
  const handleProductionDateChange = (date) => {
    setSelectedProductionDate(date);
  };
//-----

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!selectedVehicle){
      getVehicle();
    }else{
      if(props.selectedVehicleId != selectedVehicle.id){
        getVehicle();
      }
      if(props.refresh){
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
        setSelectedProductionDate(vehicles[0].production_date);
        props.setSelectedVehicle(vehicles[0]);
        console.log(vehicles[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editVehicl = async (id, name, mileage, brand, model, production_date, vin, color) => {
    const res = await fetch(`${server}/api/editVehicle`, {
      method: "POST",
      body: JSON.stringify({
        name,
        mileage,
        brand,
        model,
        production_date,
        vin,
        color
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
        vehicleId: id,
      },
    });
    if (!res.error) {
      return res;
    } else {
      const error = new Error(res.error);
      throw error;
    }
  };
  const editVehicle = async(event)=>{
    event.preventDefault();
    alert("sacvascv");
    try {
      const res = await editVehicl(props.selectedVehicleId, event.target.nameTF.value, event.target.mileageTF.value, event.target.brandTF.value, event.target.modelTF.value,
        moment(selectedProductionDate).format('YYYY-MM-DD'), event.target.vinTF.value, event.target.colorTF.value);
        
      console.log(res)
      if(res.status===200){
        props.setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <Title>Selected Vehicle</Title>
      <Grid container spacing={2}>
        <Grid item md={9} container>
          {selectedVehicle?<div>
            {isEditing?<div>
              <form onSubmit={editVehicle} noValidate autoComplete="off">  
                <Grid container spacing={2}>
                  <Grid item xs={12} container>
                    <Typography color="textSecondary" className={classes.depositContext}>
                      id: {selectedVehicle.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container>
                    <TextField id="nameTF" name="nameTF" label="Name" variant="outlined" defaultValue={selectedVehicle.name} required/>
                  </Grid>
                  <Grid item xs={12} container>
                    <TextField id="mileageTF" name="mileageTF" label="Mileage" variant="outlined" defaultValue={selectedVehicle.mileage} required/>
                  </Grid> 
                  <Grid item xs={12} container>
                    <TextField id="brandTF" name="brandTF" label="Brand" variant="outlined" defaultValue={selectedVehicle.brand} />
                  </Grid> 
                  <Grid item xs={12} container>
                    <TextField id="modelTF" name="modelTF" label="Model" variant="outlined" defaultValue={selectedVehicle.model} />
                  </Grid> 
                  <Grid item xs={3} container justify='center'>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="production_date_picker"
                        label="Production Date"
                        format="DD/MM/YYYY"
                        value={selectedProductionDate}
                        onChange={handleProductionDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid> 
                  <Grid item xs={12} container >
                    <TextField id="vinTF" name="vinTF" label="Vin" variant="outlined" defaultValue={selectedVehicle.vin}/>
                  </Grid> 
                  <Grid item xs={12} container >
                    <TextField id="colorTF" name="colorTF" label="Color" variant="outlined" defaultValue={selectedVehicle.color}/>
                  </Grid> 
                  <Grid item xs={12} container >
                    <Button
                      size = "small"
                      type = "submit"
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </Grid> 
                </Grid>
              </form>
            </div>:<div>            
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
            </div>}
          </div>:<div></div>}
        </Grid>
        <Grid item md={3} container justify='flex-end'>
            <Button
              size='small'
              variant="outlined"
              color="primary"
              onClick={()=>{if(!isEditing){setIsEditing(true)}else{setIsEditing(false)}}}
            >
              Edit
            </Button>
        </Grid> 
      </Grid>
      
      

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
