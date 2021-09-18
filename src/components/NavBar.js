import  { useState, useRef } from 'react'
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

export default function NavBar({ inNote, noteId, inUser, canShare }) {

    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openShareNoteForm, setOpenShareNoteForm] = useState(false);
    const { openSnackbar, setOpenSnackbar, message, setMessage, user, timeout } = useAuth()
    const shareEmailRef = useRef();
    const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

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
            setMessage(e.message);
            setOpenSnackbar(true);
        }
    };

    const goToProfile = async () => {
        setAnchorEl(null);
        history.push("/profile")
    };

    const startShareNote = () => {
        setOpenShareNoteForm(true);
    }

    const endShareNote = () => {
        setOpenShareNoteForm(false);
    }


    const processShareNote = () => {
        try {

            firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(shareEmailRef.current.value)}-user`).child(noteId).update({ noteId: noteId });
        } catch (e) {
            setOpenSnackbar(true)
            setMessage(e.message)
        }

        setOpenShareNoteForm(false);
    }

    const goToNewNote = async (e) => {
        const noteId = uuid();
        try {
            setIsCreatingNewNote(true);
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).child(noteId).update({ noteId: noteId });
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-misc`).update({ createdBy: user.email, createdTime: new Date().getTime(), title: "Untitled" });
        } catch (e) {
            await timeout(1500)
            setIsCreatingNewNote(false);
            setOpenSnackbar(true)
            setMessage("Error on creating a new Note");
            return;
        }

        await timeout(500);

        setIsCreatingNewNote(false);
        history.push(`/note/${noteId}`)
    }
    return (
        <AppBar position="static" color="primary">
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                // onClose={handleClose}
                message={message}
                autoHideDuration={3000}
                onClose={() => { setOpenSnackbar(false); setMessage("") }}
            //  key={vertical + horizontal}
            />
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <Button component={Link} to="/home" color="inherit"> <HomeIcon /></Button>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Collaborative Note
                </Typography>
                {!inUser && <Button component={Link} to="/login" color="inherit"> <AccountCircle /> Log In</Button>}
                {inUser && !inNote && <Button onClick={goToNewNote} color="inherit"> <AddCircleIcon />   Create A New Note</Button>}
                {inUser && inNote && canShare && <Button onClick={startShareNote} color="inherit">
                    <ShareIcon />   Share Note

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
                <Dialog open={openShareNoteForm} onClose={endShareNote} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Share Note</DialogTitle>
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
                        <Button onClick={endShareNote} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={processShareNote} color="primary">
                            Share
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={isCreatingNewNote} onClose={() => { setIsCreatingNewNote(false) }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Creating Note</DialogTitle>
                    <DialogContent>
                        <DialogContentText className='center'>
                            Creating New Note... Please wait...
                            <CircularProgress />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    )
}
