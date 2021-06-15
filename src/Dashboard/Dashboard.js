import React, {useEffect, useState} from 'react';
import { secondaryListItems } from './listItems';
import SelectedVehicle from './SelectedVehicle';
import Vehicles from './Vehicles';
import { useHistory} from "react-router-dom";

//material-ui imports
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import DirectionsCarOutlinedIcon from '@material-ui/icons/DirectionsCarOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AddVehicle from './AddVehicle';
import Services from './Services';
import AddService from './AddService';
import Maintenances from './Maintenances';
import AddMaintenance from './AddMaintenance';
import NextMaintenances from './NextMaintenances';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {/*
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  
  const classes = useStyles();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [open, setOpen] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(localStorage.getItem('selectedVehicleId'));
  const [selectedVehicle, setSelectedVehicle] = useState(false);
  const [selectedContent, setselectedContent] = useState('Vehicles');
  const [username, setUsername] = useState();
  const [refresh, setRefresh] = useState();

  useEffect(()=>{
    getUsername();
  },[]);

  const server = 'http://localhost:3001';
  const getUsername = async()=>{
    setToken(localStorage.getItem('token'));

    fetch(`${server}/api/getUsername`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        //console.log(res)
        return res.json();
      })
      .then((data) => {
        setUsername(data[0].name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const history = useHistory();


  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  let mainContent=<div></div>;

  if(selectedContent=='Vehicles'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>
        {/* Vehicles */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Vehicles setSelectedVehicleId={setSelectedVehicleId} refresh={refresh} setRefresh={setRefresh}/>
          </Paper>
        </Grid>
        {/*Add Vehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AddVehicle setRefresh={setRefresh}/>
          </Paper>
        </Grid>
      </Grid>
  }
  if(selectedContent=='Add Vehicle'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>

        {/*Add Vehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AddVehicle setRefresh={setRefresh}/>
          </Paper>
        </Grid>
      </Grid>
  }
  if(selectedContent=='Services'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>
        {/*AddService */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AddService setRefresh={setRefresh}/>
          </Paper>
        </Grid>
        {/*Services */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Services refresh={refresh} setRefresh={setRefresh}/>
          </Paper>
        </Grid>
        
      </Grid>
  }
  if(selectedContent=='Add Service'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>
        {/*AddService */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AddService setRefresh={setRefresh}/>
          </Paper>
        </Grid>       
      </Grid>
  }
  if(selectedContent=='Maintenances'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>
        {/*AddMaintenance */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <AddMaintenance setRefresh={setRefresh}/>
          </Paper>
        </Grid>
        {/*Maintenances */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Maintenances refresh={refresh} setRefresh={setRefresh}/>
          </Paper>
        </Grid>
        
      </Grid>
  }

  if(selectedContent=='Next maintenances'){
    mainContent=
      <Grid container spacing={3}>
        {/* SelectedVehicle */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          {/*<Paper className={fixedHeightPaper}>*/}
            <SelectedVehicle selectedVehicleId={selectedVehicleId} refresh={refresh} setRefresh={setRefresh} setSelectedVehicle={setSelectedVehicle}/>
          </Paper>
        </Grid>
        {/*NextMaintenances */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <NextMaintenances refresh={refresh} setRefresh={setRefresh} selectedVehicle={selectedVehicle}/>
          </Paper>
        </Grid>
      </Grid>
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {selectedContent} 
          </Typography>
          <Typography variant="h6" color="inherit">
            {username} 
          </Typography>
          <IconButton color="inherit" onClick={()=>{localStorage.removeItem("token"); history.go(0);}}>
            <Typography variant="body2" color="inherit">
              Log Out
            </Typography>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/*list of menu items*/}
        <List>
          <ListItem button onClick={()=>{setselectedContent('Vehicles')}}>
            <ListItemIcon>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicles" />
          </ListItem>
          <ListItem button onClick={()=>{setselectedContent('Add Vehicle')}}>
            <ListItemIcon>
              <DirectionsCarOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Add vehicle" />
          </ListItem>
          <Divider />
          <ListItem button onClick={()=>{setselectedContent('Services')}}>
            <ListItemIcon>
              <LibraryBooksOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Services" />
          </ListItem>
          <ListItem button onClick={()=>{setselectedContent('Add Service')}}>
            <ListItemIcon>
              <LibraryAddOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Add service" />
          </ListItem>
          <Divider />
          <ListItem button onClick={()=>{setselectedContent('Next maintenances')}}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Next maintenances" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LibraryAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add maintenance" />
          </ListItem>
          <ListItem button onClick={()=>{setselectedContent('Maintenances')}}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Maintenances" />
          </ListItem>
        </List>
        <Divider />
        {/*
        <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        <List>{secondaryListItems}</List>
        */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {mainContent}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
