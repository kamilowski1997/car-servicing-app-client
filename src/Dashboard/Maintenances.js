import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import EditMaintenance from './EditMaintenance';

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
        <TableCell >{row.date}</TableCell>
        <TableCell >{row.mileage}</TableCell>
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
                  <Paper>
                    <EditMaintenance row={row} maintenanceId={row.id} setRefresh={props.setRefresh}/>
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

export default function Maintenances(props) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [maintenances, setMaintenances] = useState(false);

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!maintenances){
      getMaintenances();
    }
    if(props.refresh){
      getMaintenances();
      props.setRefresh(false);
    }
  });

  const getMaintenances = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getMaintenances`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
        selectedVehicleId: localStorage.getItem('selectedVehicleId'),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((maintenances) => {
        setMaintenances(maintenances);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Maintenances</Title>
      {maintenances?
      <Table size="small" aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Mileage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenances.map((row) => (
            <Row key={row.id} row={row} setRefresh={props.setRefresh} />
          ))}
        </TableBody>
      </Table>
      :<div></div>}
    </React.Fragment>
  );
}
