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
import { firebaseAuth } from '../Firebase';
import ShareIcon from '@material-ui/icons/Share';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SHA256 from "crypto-js/sha256";
import { CircularProgress } from '@material-ui/core';
import { DataGrid, GridRowsProp, GridColDef } from '@material-ui/data-grid'

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

const columns = [
    { field: 'userEmail', headerName: 'Email', width: 200 },
];

export default function NavBar({ inNote, noteId, inUser, canShare, ownerEmail, sharedUsers, setSharedUsers }) {

    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openShareNoteForm, setOpenShareNoteForm] = useState(false);
    const [openViewSharedUsers, setOpenViewSharedUsers] = useState(false);
    const { openSnackbar, setOpenSnackbar, message, setMessage, user, timeout } = useAuth()
    const shareEmailRef = useRef();
    const [selectedUserEmails, setSelectedUserEmails] = useState([]);
    const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = () => {
        setAnchorEl(null);
        try {
            firebaseAuth.signOut();
            history.push('/login')
        } catch (e) {
            setMessage(e.message);
            setOpenSnackbar(true);
        }
    };

    const goToProfile = () => {
        setAnchorEl(null);
        history.push("/profile")
    };

    const startShareNote = () => {
        setOpenShareNoteForm(true);
    }

    const endShareNote = () => {
        setOpenShareNoteForm(false);
    }

    const startOpenViewSharedUsers = () => {
        setOpenViewSharedUsers(true);
    }

    const endOpenViewSharedUsers = () => {
        setOpenViewSharedUsers(false);
    }

    const removeSharedUsers = () => {
        const finalSharedUsers = [];
        for(let i = 0; i < sharedUsers.length; i++) {
            if (!selectedUserEmails.includes(sharedUsers[i].userEmail)) {
                finalSharedUsers.push(sharedUsers[i]);
            }
        }
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-shared`).update({ sharedUsers: finalSharedUsers });

        for (let i = 0; i < selectedUserEmails.length; i++) {
            const selectedEmail = selectedUserEmails[i];
            firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(selectedEmail)}-user`).child(noteId).remove();
        }
        if (finalSharedUsers.length === 0) {
            setSharedUsers(finalSharedUsers);
        }
        setOpenViewSharedUsers(false);
    }

    const processShareNote = () => {
        try {
            const userToShare = shareEmailRef.current.value
            if (user && user.email === userToShare) {
                setOpenSnackbar(true)
                setMessage("Cannot share with yourself");
            } else if (userToShare && !sharedUsers.includes(userToShare)) {
                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(shareEmailRef.current.value)}-user`).child(noteId).update({ noteId: noteId });
                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-shared`).update({ sharedUsers: [...sharedUsers, {userEmail : userToShare}] });
             //   setSharedUsers(arr => [...arr, {userEmail : userToShare}]);
                setOpenViewSharedUsers()
            }
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
                
                {inUser && inNote && canShare && user.email && user.email === ownerEmail && <Button onClick={startShareNote} color="inherit">
                    <ShareIcon />   Share With Friend
                </Button>}
                {inUser && inNote && canShare && user.email && user.email === ownerEmail && <Button onClick={startOpenViewSharedUsers} color="inherit">
                    <PeopleOutlineIcon />   Shared Users
                </Button>}

                {inUser && inNote && canShare && user.email !== ownerEmail &&  <Typography variant="h6">
                    Shared by: {ownerEmail}
                </Typography>}

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
                
                <Dialog open={openViewSharedUsers} onClose={endOpenViewSharedUsers} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Shared Users</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"     These users have access to this note:          "} 
                        </DialogContentText>
                        <div style={{ height: 300 }}>
                            <DataGrid 
                                rows={sharedUsers ? [...sharedUsers] : []}  
                                getRowId={(row) => row.userEmail}
                                columns={columns} 
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                disableSelectionOnClick
                                hideFooter
                                onSelectionModelChange={(ids) => {
                                    setSelectedUserEmails([...ids])
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={removeSharedUsers} color="primary">
                            Remove Selected Users
                        </Button>
                        <Button onClick={endOpenViewSharedUsers} color="primary">
                            Close
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
