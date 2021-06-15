import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({

}));

export default function EditService(props) {
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
  const [selectedDate, setSelectedDate] = useState(props.row.date);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

//api
  const server = 'http://localhost:3001';
  const editService = (id, name, date, mileage, description) => {
    return fetch(`${server}/api/editService`, {
      method: "POST",
      body: JSON.stringify({
        name, 
        date, 
        mileage, 
        description,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
        serviceId: id,
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
  const deleteServ = (id) => {
    return fetch(`${server}/api/deleteService`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
        serviceId: id,
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
  const deleteService = async(id)=>{
    try {
      const res = await deleteServ(id);
      console.log(res)
      if(res.status===200){
        props.setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async(event)=>{
    event.preventDefault();
    try {
      const res = await editService(props.serviceId, event.target.name.value, moment(selectedDate).format('YYYY-MM-DD'), event.target.mileage.value, 
        event.target.description.value);
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

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Edit service</Title>
      <form onSubmit={onSubmit} noValidate autoComplete="off">  
        <Grid container spacing={2}>
          <Grid item xs={9}>
          </Grid> 
          <Grid item md={3} container justify='flex-end'>
            <Button
              size='small'
              variant="outlined"
              color="secondary"
              onClick={()=>{deleteService(props.row.id);}}
            >
              Delete
            </Button>
          </Grid> 
          <Grid item md={3} container justify='center'>
            <TextField id="name" name="name" label="Name" variant="outlined" defaultValue={props.row.name} required/>
          </Grid>
          <Grid item md={3} container justify='center'>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date"
                label="Service Date"
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
            <TextField id="mileage" name="mileage" label="Mileage" variant="outlined" defaultValue={props.row.mileage} required/>
          </Grid> 
          
          <Grid item md={9} container justify='center'>
            <TextField id="description" name="description" label="Description" variant="outlined" defaultValue={props.row.description} fullWidth />
          </Grid> 
          <Grid item md={3} container justify='center'>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          </Grid> 
        </Grid>      
      </form>
      <Snackbar open={openSuccesAlert} autoHideDuration={6000} onClose={handleCloseSuccesAlert}>
        <Alert onClose={handleCloseSuccesAlert} severity="success">
          Edited service!
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
        <Alert onClose={handleCloseErrorAlert} severity="error">
          Error editing service, please try again.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
