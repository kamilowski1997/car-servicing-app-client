import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import ConfirmMaintenance from './ConfirmMaintenance';
import moment from "moment";

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell >{moment(row.date).format('DD.MM.YYYY')}</TableCell>
        <TableCell >{row.mileage}</TableCell>
        <TableCell >{row.time_interval}</TableCell>
        <TableCell >{row.mileage_interval}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} container>
                  <Paper>
                    <Grid item xs={12}>
                      <Title>Description</Title>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{whiteSpace: "unset", wordBreak: "break-all"}}> 
                          <Typography variant="body2" display="inline">
                            {row.description}
                          </Typography>
                        </div>
                    </Grid>
                  </Paper>
                </Grid>                
                <Grid item xs={12} container>
                  <Paper style={{width:"80%"}}  >
                    <ConfirmMaintenance row={row} nextMaintenanceId={row.id} setRefresh={props.setRefresh} selectedVehicle={props.selectedVehicle}/>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({

}));

export default function NextMaintenances(props) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [nextMaintenances, setNextMaintenances] = useState(false);

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!nextMaintenances){
      getNextMaintenances();
    }
    if(props.refresh){
      getNextMaintenances();
      props.setRefresh(false);
    }
  });

  const getNextMaintenances = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getNextMaintenances`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
        selectedVehicleId: localStorage.getItem('selectedVehicleId'),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((nextMaintenances) => {
        setNextMaintenances(nextMaintenances);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Next Maintenances</Title>
      {nextMaintenances?
      <Table size="small" aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Mileage</TableCell>
            <TableCell>Time interval (months)</TableCell>
            <TableCell>Mileage interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nextMaintenances.map((row) => (
            <Row key={row.id} row={row} setRefresh={props.setRefresh} selectedVehicle={props.selectedVehicle} />
          ))}
        </TableBody>
      </Table>
      :<div></div>}
    </React.Fragment>
  );
}
