import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import NavBar from './NavBar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import { useHistory } from 'react-router-dom';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
import { CircularProgress, LinearProgress, Typography } from '@material-ui/core';
import SHA256 from "crypto-js/sha256";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      verticalAlign: 'middle',
      color: theme.palette.text.secondary,
      fontSize: '30px'
    },
    relativeDiv: {
        position: 'relative',
    },
    leftIcon: {
        flexGrow: 1,
    },
    rightIcon: {
        display:'block',
        position: 'absolute',
        top: '-7px',
        right: '-10px'
    },
    icon: {
        color: 'rgb(48, 128, 188)'
    }
  }));

function Home() {

    const { user, timeout, setMessage, setOpenSnackbar } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const [myNotes, setMyNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [deleteNoteTitle, setDeleteNoteTitle] = useState("");
    const [deleteNoteId, setDeleteNoteId] = useState("");
    useEffect( () => {
        if (!user) {
            history.push('/login')
            return;
        }
        setLoading(true)
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).on('child_added', function(data) {
            var childData = data.val();
            if (childData) {
                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${childData.noteId}-misc`).on('value', function(titleData) {
                    var titleChild = titleData.val();
                    const found = myNotes.some(el => el.noteId === childData.noteId);
                    if (!found) {
                        setMyNotes(arr =>[...arr, {...titleChild, noteId : childData.noteId}].sort((a, b) =>{
                            return a.createdTime < b.createdTime;
                        }))
                    }
                })
            }

        })
       
        setTimeout( ()=>setLoading(false), 1000);

      }, [])

    const confirmDeleteNote = (open, title, noteId) => {
        setOpenDeleteConfirm(open); 
        setDeleteNoteTitle(title);
        setDeleteNoteId(noteId);
    }

    const deleteNoteAction = async () => {
        try {
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).child(deleteNoteId).remove();
        } catch (e) {
            setOpenSnackbar(true)
            setMessage(e.message)
            confirmDeleteNote(false, "", "")
            return
        }
        setMyNotes(arr =>[...arr].filter(obj=>obj.noteId !== deleteNoteId).sort((a, b) =>{
            return a.createdTime < b.createdTime;
        }))
        confirmDeleteNote(false, "", "")
    }

    return (
        <div>
            <NavBar inUser={true} ></NavBar>
            {user && loading && <div className='center'><CircularProgress color='primary'size={60} /><Typography variant="h5">Loading Notes...</Typography></div> }
            { user && !loading && <Box m={2} pt={3}>
                <Box m={2} pt={3}>
                <Typography className='center' variant="h4" > My Notes</Typography>
                <Divider variant="middle"/>
                </Box>
                <Grid container spacing={3}>
                {(myNotes.length === 0 || !myNotes.some(el => el.createdBy === user.email)) ? <Typography variant="h5" >No notes found</Typography> :
                [...myNotes].map((x, i) => 
                    x.createdBy === user.email &&
                    <Grid item xs={4} key={x.noteId}>
                        <Card className={classes.root}>
                            <CardContent   className={classes.paper}> 
                                <Typography className={classes.relativeDiv}>
                                    <AssignmentIcon className={classes.leftIcon} color='primary' /> 
                                    <Button  onClick={()=>{confirmDeleteNote(true, x.title, x.noteId)}}className={classes.rightIcon}><DeleteForeverIcon  color="primary"/></Button>
                                </Typography>
                                <CardActionArea component={Link} to={`/note/${x.noteId}`}>    
                                        <Typography variant="h5" > {x.title}</Typography>
                                        <Typography variant="body1" > {" "}</Typography>
                                        <Typography variant="caption" > {new Date(x.createdTime).toString()}</Typography>
                                </CardActionArea>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                </Grid>
                <Box m={2} pt={3}>
                <Typography className='center' variant="h4" > Notes shared with me</Typography>
                <Divider variant="middle" />
                </Box>
                
                <Grid container spacing={3}>
                {(myNotes.length === 0 || !myNotes.some(el => el.createdBy !== user.email)) ? <Typography variant="h5" >No notes found</Typography> :
                [...myNotes].map((x, i) => 
                    x.createdBy !== user.email &&
                    <Grid item xs={4} key={x.noteId}>
                        <Card className={classes.root}>
                        <CardContent   className={classes.paper}> 
                               <Typography className={classes.relativeDiv}>
                                    <AssignmentIcon className={classes.leftIcon} color='primary' /> 
                                    <Button  onClick={()=>{confirmDeleteNote(true, x.title, x.noteId)}}className={classes.rightIcon}><DeleteForeverIcon  color="primary"/></Button>
                                </Typography>

                            <CardActionArea component={Link} to={`/note/${x.noteId}`}>
                            
                                <Typography variant="h5" > {x.title}</Typography>
                                <Typography variant="body1" > From: {x.createdBy}</Typography>
                                <Typography variant="caption" > {new Date(x.createdTime).toString()}</Typography>
                                 
                            </CardActionArea>
                        </CardContent>
                        </Card>

                    </Grid>
                )}
                </Grid>

            </Box> }

            <Dialog open={openDeleteConfirm} onClose={()=>{confirmDeleteNote(false, "", "")}} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Deleting Note</DialogTitle>
                <DialogContent>
                <DialogContentText className='center'>
                    Delete {deleteNoteTitle} ?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>{confirmDeleteNote(false, "", "")}} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=>{deleteNoteAction()}} color="primary">
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Home
