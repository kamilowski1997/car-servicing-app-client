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
import moment from "moment";

export default function Vehicles(props) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [vehicles, setVehicles] = useState(false);

  const server = 'http://localhost:3001';

  useEffect(() =>{
    if(!vehicles){
      getVehicles();
    }
    if(props.refresh){
      getVehicles();
      props.setRefresh(false);
    }
  });

  const getVehicles = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getVehicles`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((vehicles) => {
        setVehicles(vehicles);
        //console.log(vehicles);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Title>Vehicles</Title>
      {vehicles?
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Mileage</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Production Date</TableCell>
            <TableCell>Vin</TableCell>
            <TableCell>Color</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Button variant="outlined" color="primary" size="small" onClick={()=>{localStorage.setItem('selectedVehicleId', row.id);props.setSelectedVehicleId(row.id);}}>
                  Select
                </Button>
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.mileage}</TableCell>
              <TableCell>{row.brand}</TableCell>
              <TableCell>{row.model}</TableCell>
              <TableCell>{moment(row.production_date).format('DD.MM.YYYY')}</TableCell>
              <TableCell>{row.vin}</TableCell>
              <TableCell>{row.color}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      :<div></div>}
    </React.Fragment>
  );
}
