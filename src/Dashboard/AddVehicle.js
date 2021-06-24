import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import Title from './Title';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddVehicle(props) {
//handling alerts
  const [openSuccesAlert, setOpenSuccesAlert] = React.useState(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);

  const handleCloseSuccesAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccesAlert(false);
  };
  const handleCloseErrorAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorAlert(false);
  };
//date
  const [selectedProductionDate, setSelectedProductionDate] = useState(null);
  const handleProductionDateChange = (date) => {
    setSelectedProductionDate(date);
  };

//api
  const server = 'http://localhost:3001';
  const addVehicle = (name, mileage, brand, model, production_date, vin, color) => {
    return fetch(`${server}/api/addVehicle`, {
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
      },
    }).then((res) => {
      if (!res.error) {
        return res;
      } else {
        const error = new Error(res.error);
        throw error;
      }
    });
  };

  const onSubmit = async(event)=>{
    event.preventDefault();
    try {
      let res;
      if(selectedProductionDate == null){
        res = await addVehicle(event.target.name.value, event.target.mileage.value, event.target.brand.value, event.target.model.value, 
          selectedProductionDate, event.target.vin.value, event.target.color.value);
      }else{
        res = await addVehicle(event.target.name.value, event.target.mileage.value, event.target.brand.value, event.target.model.value, 
          selectedProductionDate.format('YYYY-MM-DD'), event.target.vin.value, event.target.color.value);
      }

      if(res.status===200){
        setOpenSuccesAlert(true);
        props.setRefresh(true);
      }      
    } catch (error) {
      console.error(error);
      setOpenErrorAlert(true);
    }
  }

  return (
    <React.Fragment>
      <Title>Add Vehicle</Title>
      <form onSubmit={onSubmit} noValidate autoComplete="off">  
        <Grid container spacing={2}>
          <Grid item xs={3} container justify='center'>
            <TextField id="name" name="name" label="Name" variant="outlined" required/>
          </Grid>
          <Grid item xs={3} container justify='center'>
            <TextField id="mileage" name="mileage" label="Mileage" variant="outlined" required/>
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <TextField id="brand" name="brand" label="Brand" variant="outlined" />
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <TextField id="model" name="model" label="Model" variant="outlined" />
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="production_date"
                label="Production Date"
                format="DD.MM.YYYY"
                value={selectedProductionDate}
                onChange={handleProductionDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <TextField id="vin" name="vin" label="Vin" variant="outlined" />
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <TextField id="color" name="color" label="Color" variant="outlined" />
          </Grid> 
          <Grid item xs={3} container justify='center'>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Grid> 
        </Grid>      
      </form>
      <Snackbar open={openSuccesAlert} autoHideDuration={6000} onClose={handleCloseSuccesAlert}>
        <Alert onClose={handleCloseSuccesAlert} severity="success">
          Added Vehicle!
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
        <Alert onClose={handleCloseErrorAlert} severity="error">
          Error adding vehicle, please try again.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
