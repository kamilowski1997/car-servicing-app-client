import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Title from './Title';
import AddService from './AddService';


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({

}));

export default function Services(props) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [services, setServices] = useState(false);

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!services){
      getServices();
    }
    if(props.refresh){
        getServices();
      props.setRefresh(false);
    }
  });

  const getServices = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getServices`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
        selectedVehicleId: localStorage.getItem('selectedVehicleId'),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((services) => {
        setServices(services);
        console.log(services);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Services</Title>
      <AddService />
      {services?
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Mileage</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.mileage}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
      :<div></div>}
    </React.Fragment>
  );
}
