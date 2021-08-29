import Recat, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles.css'
import firebase from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import TitleIcon from '@material-ui/icons/Title';
import Snackbar from '@material-ui/core/Snackbar';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import uuid from 'react-uuid'
import { useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function NavBar({inDoc}) {

    const classes = useStyles();
    const history = useHistory();

    const { openSnackbar, setOpenSnackbar, message, setMessage, user, sessionId } = useAuth()

    const goToNewDoc = async (e) => {
        const docId = uuid();
        try {
            console.log("++++++ creating doc to firebase")
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${user.uid}-user`).push({ docId: docId } );
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-title`).push({ sessionId: sessionId , title : "Untitled" } );
        } catch (e) {
            setOpenSnackbar(true)
            setMessage("Error on creating a new document");
            return;
        }
        history.push(`/doc/${docId}`)
        
    }
    return (
        <AppBar position="static">
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
             open={openSnackbar}
            // onClose={handleClose}
            message={message}
            autoHideDuration={3000}
            onClose={() =>{ setOpenSnackbar(false); setMessage("")}}
          //  key={vertical + horizontal}
        />
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Button component={Link} to="/home" color="inherit"> <HomeIcon /></Button>   
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            Collaborative Doc
            </Typography>
             {!user && <Button component={Link} to="/login" color="inherit"> <AccountCircle/> Log In</Button>}
             {user && !inDoc && <Button onClick={goToNewDoc} color="inherit"> <AddCircleIcon/>   Create A New Doc</Button>}
        </Toolbar>
        </AppBar> 
    )
}
