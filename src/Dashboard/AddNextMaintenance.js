import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

export default function AddNextMaintenance(props) {
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
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

//api
  const server = 'http://localhost:3001';
  const addNextMaintenance = (name, date, mileage, time_interval, mileage_interval, description) => {
    return fetch(`${server}/api/addNextMaintenance`, {
      method: "POST",
      body: JSON.stringify({
        name, 
        date, 
        mileage, 
        time_interval,
        mileage_interval,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
        selectedVehicleId: localStorage.getItem('selectedVehicleId'),
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
      const res = await addNextMaintenance(event.target.name.value, selectedDate.format('YYYY-MM-DD'), event.target.mileage.value, event.target.time_interval.value,
        event.target.mileage_interval.value, event.target.description.value);
      console.log(res)
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
      <Title>Add next maintenance</Title>
      <form onSubmit={onSubmit} noValidate autoComplete="off">  
        <Grid container spacing={2}>
          <Grid item md={3} container justify='center'>
            <TextField id="name" name="name" label="Name" variant="outlined" required/>
          </Grid>
          <Grid item md={3} container justify='center'>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date"
                label="Next maintenance date"
                format="DD.MM.YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                required
              />
            </MuiPickersUtilsProvider>
          </Grid> 
          <Grid item md={3} container justify='center'>
            <TextField id="mileage" name="mileage" label="Next mileage" variant="outlined" required/>
          </Grid> 
          <Grid item md={3} container justify='center'>
            <TextField id="time_interval" name="time_interval" label="Time interval (months)" variant="outlined"/>
          </Grid> 
          <Grid item md={3} container justify='center'>
            <TextField id="mileage_interval" name="mileage_interval" label="Mileage interval" variant="outlined"/>
          </Grid> 
          <Grid item md={9} container justify='center'>
            <TextField id="description" name="description" label="Description" variant="outlined" fullWidth />
          </Grid> 
          <Grid item md={9} container>
          </Grid> 
          <Grid item md={3} container justify='center'>
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
          Added next maintenance!
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
        <Alert onClose={handleCloseErrorAlert} severity="error">
          Error adding next maintenance, please try again.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
