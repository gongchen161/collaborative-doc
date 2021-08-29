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
    icon: {
        color: 'rgb(48, 128, 188)'
    }
  }));

function Home() {

    const { user, timeout } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const [myDocs, setMyDocs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        if (!user) {
            history.push('/login')
            return;
        }

        console.log("start loading")
        setLoading(true)
        console.log("done loading")

        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).on('child_added', function(data) {
            console.log("------ fetching user from firebase")
            var childData = data.val();
            if (childData) {

                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${childData.docId}-misc`).on('value', function(titleData) {
                    console.log("------ fetching user-title from firebase")
                    var titleChild = titleData.val();
                    const found = myDocs.some(el => el.docId === childData.docId);
                    if (!found) {
                        setMyDocs(arr =>[...arr, {...titleChild, docId : childData.docId}].sort((a, b) =>{
                            return a.createdTime < b.createdTime;
                        }))
                    }
                })
            }

        })

        console.log(myDocs)
       
        setTimeout( ()=>setLoading(false), 1000);

      }, [])
    console.log("home page rendering")

    return (
        <div>
            <NavBar></NavBar>
            {loading && <div className='center'><CircularProgress color='primary'size={60} /><Typography variant="h5">Loading Docs...</Typography></div> }
            { !loading && <Box m={2} pt={3}>
                <Box m={2} pt={3}>
                <Typography className='center' variant="h4" > My Docs</Typography>
                <Divider variant="middle"/>
                </Box>
                <Grid container spacing={3}>
                {(myDocs.length === 0 || !myDocs.some(el => el.createdBy === user.email)) ? <Typography variant="h5" >No docs found</Typography> :
                [...myDocs].map((x, i) => 
                    x.createdBy === user.email &&
                    <Grid item xs={4} key={x.docId}>
                        <Card className={classes.root}>
                        <CardActionArea component={Link} to={`/doc/${x.docId}`}>
                            <CardContent   className={classes.paper}> 
                                <AssignmentIcon color='primary' /> 
                                <Typography variant="h5" > {x.title}</Typography>
                                <Typography variant="body1" > {" "}</Typography>
                                <Typography variant="caption" > {new Date(x.createdTime).toString("MMM dd hh:mm")}</Typography>
                                 </CardContent>
                        </CardActionArea>
                        </Card>
                    </Grid>
                )}
                </Grid>
                <Box m={2} pt={3}>
                <Typography className='center' variant="h4" > Docs shared to me</Typography>
                <Divider variant="middle" />
                </Box>
                
                <Grid container spacing={3}>
                {(myDocs.length === 0 || !myDocs.some(el => el.createdBy !== user.email)) ? <Typography variant="h5" >No docs found</Typography> :
                [...myDocs].map((x, i) => 
                    x.createdBy !== user.email &&
                    <Grid item xs={4} key={x.docId}>
                        <Card className={classes.root}>
                        <CardActionArea component={Link} to={`/doc/${x.docId}`}>
                            <CardContent   className={classes.paper}> 
                                <AssignmentIcon color='primary' /> 
                                <Typography variant="h5" > {x.title}</Typography>
                                <Typography variant="body1" > From: {x.createdBy}</Typography>
                                <Typography variant="caption" > {new Date(x.createdTime).toString()}</Typography>
                                 </CardContent>
                        </CardActionArea>
                        </Card>
                    </Grid>
                )}
                </Grid>

            </Box> }
        </div>
    )
}

export default Home
