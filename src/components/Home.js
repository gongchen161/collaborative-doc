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
  }));

function Home() {

    const { user } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const [myDocs, setMyDocs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        if (!user) {
            history.push('/login')
            return;
        }

        console.log("start loading")
        setLoading(true)
        console.log("done loading")

        await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).on('child_added', function(data) {
            console.log("------ fetching user from firebase")
            var childData = data.val();
            if (childData) {

                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${childData.docId}-misc`).on('value', function(titleData) {
                    console.log("------ fetching user-title from firebase")
                    var titleChild = titleData.val();
                    setMyDocs(arr =>[...arr, {docId : childData.docId, title: titleChild.title }])
                })
            }

        })

        console.log(myDocs)
        setTimeout(() => { setLoading(false) }, 1500);

      }, [])
    console.log("home page rendering")

    return (
        <div>
            <NavBar></NavBar>
            {loading && <div className='center'><CircularProgress color='primary'size={60} /><Typography variant="h5">Loading Docs...</Typography></div> }
            { !loading && <Box m={2} pt={3}>
                <Grid container spacing={3}>
                {[...myDocs].map((x, i) =>
                    <Grid item xs={4} key={x.docId}>
                        <Card className={classes.root}>
                        <CardActionArea component={Link} to={`/doc/${x.docId}`}>
                            <CardContent   className={classes.paper}> 
                                <AssignmentIcon /> 
                                <Typography variant="h6" > {x.title}</Typography>
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
