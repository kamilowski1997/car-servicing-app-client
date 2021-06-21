import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import Title from './Title';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ConfirmMaintenance(props) {
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
  const [selectedDate, setSelectedDate] = useState(moment());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

//api
  const server = 'http://localhost:3001';
  const confirmMaintenance = (id, done_date, done_mileage) => {
    return fetch(`${server}/api/confirmMaintenance`, {
      method: "POST",
      body: JSON.stringify({
        done_date, 
        done_mileage, 
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
        nextMaintenanceId: id,
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
      console.log(props.nextMaintenanceId)
      const res = await confirmMaintenance(props.nextMaintenanceId, moment(selectedDate).format('YYYY-MM-DD'), event.target.done_mileage.value);
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
      <Title>Confirm maintenance</Title>
      <form onSubmit={onSubmit} noValidate autoComplete="off">  
        <Grid container spacing={2}>
          <Grid item md={4} container>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date"
                label="Done maintenance date"
                style={{width:"100%", margin:"5px"}} 
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                required
              />
            </MuiPickersUtilsProvider>
          </Grid> 
          <Grid item md={4} container>
            <TextField id="done_mileage" name="done_mileage" label="Done mileage" variant="outlined" defaultValue={props.selectedVehicle.mileage} required style={{width:"100%", margin:"5px"}} />
          </Grid> 
          <Grid item md={4} container justify='center' >
            <Button
              style={{width:"100%", margin:"5px"}} 
              type="submit"
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid> 
        </Grid>      
      </form>
      <Snackbar open={openSuccesAlert} autoHideDuration={6000} onClose={handleCloseSuccesAlert}>
        <Alert onClose={handleCloseSuccesAlert} severity="success">
          Confirmed maintenance!
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
        <Alert onClose={handleCloseErrorAlert} severity="error">
          Error confirming maintenance, please try again.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
