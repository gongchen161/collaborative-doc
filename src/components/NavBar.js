import Recat, { useState, useEffect, useRef, createRef } from 'react'
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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { auth } from '../Firebase';
import ShareIcon from '@material-ui/icons/Share';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SHA256 from "crypto-js/sha256";
import { CircularProgress } from '@material-ui/core';

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

export default function NavBar({inDoc, docId, inUser}) {

    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openShareDocForm, setOpenShareDocForm] = useState(false);
    const { openSnackbar, setOpenSnackbar, message, setMessage, user, timeout } = useAuth()
    const shareEmailRef = useRef();
    const [isCreatingNewDoc, setIsCreatingNewDoc] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleSignout = async () => {
        setAnchorEl(null);
        try {
            await auth.signOut();
            history.push('/login')
        } catch (e) {
            console.log(e);
            setMessage(e.message);
            setOpenSnackbar(true);
        }
      };

      const goToProfile = async () => {
        setAnchorEl(null);
        history.push("/profile")
      };

      const startShareDoc = () =>{
          setOpenShareDocForm(true);
      }

      const endShareDoc = () => {
          setOpenShareDocForm(false);
      }


      const processShareDoc = () => {
        try {
            console.log("++++++ processShareDoc from firebase")
         
            firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(shareEmailRef.current.value)}-user`).child(docId).update({docId:docId});
        } catch (e) {
            setOpenSnackbar(true)
            setMessage(e.message)
            console.log("error loading from firebse", e)
        }

        setOpenShareDocForm(false);
    }

    const goToNewDoc = async (e) => {
        const docId = uuid();
        try {
            setIsCreatingNewDoc(true);
            console.log("++++++ creating doc to firebase")
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).child(docId).update({docId:docId});
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-misc`).update({ createdBy: user.email , createdTime: new Date().getTime(), title : "Untitled" } );
        } catch (e) {
            await timeout(1500)
            setIsCreatingNewDoc(false);
            setOpenSnackbar(true)
            setMessage("Error on creating a new document");
            return;
        }

        await timeout(500);

        setIsCreatingNewDoc(false);
        history.push(`/doc/${docId}`)
    }
    return (
        <AppBar position="static" color="primary">
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
             {!inUser && <Button component={Link} to="/login" color="inherit"> <AccountCircle/> Log In</Button>}
             {inUser && !inDoc && <Button onClick={goToNewDoc} color="inherit"> <AddCircleIcon/>   Create A New Doc</Button>}
             {inUser && inDoc && <Button onClick={startShareDoc} color="inherit"> 
                    <ShareIcon/>   Share Doc
                    
                    </Button>}
             {inUser && <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit">  
                    <MenuIcon color="inherit" />
                    </Button>  
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                    <MenuItem onClick={goToProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleSignout}>Logout</MenuItem>
                </Menu>
                </div>
             }
             <Dialog open={openShareDocForm} onClose={endShareDoc} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Share Doc</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To share, please enter the email
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    inputRef={shareEmailRef}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={endShareDoc} color="primary">
                    Cancel
                </Button>
                <Button onClick={processShareDoc} color="primary">
                    Share
                </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={isCreatingNewDoc} onClose={()=>{setIsCreatingNewDoc(false)}} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Creating Doc</DialogTitle>
                <DialogContent>
                <DialogContentText className='center'>
                    Creating New Doc... Please wait...
                    <CircularProgress  />
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>



        </Toolbar>
        </AppBar> 
    )
}