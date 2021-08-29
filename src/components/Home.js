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
    useEffect(() => {
        if (!user) {
            history.push('/login')
            return;
        }

        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${user.uid}-user`).once('child_added', function(data) {
            console.log("------ fetching user from firebase")
            var childData = data.val();
            if (childData) {
                firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${childData.docId}-title`).limitToLast(1).once('child_added', function(titleData) {
                    console.log("------ fetching user-title from firebase")
                    var titleChild = titleData.val();
                    setMyDocs(arr =>[...arr, {docId : childData.docId, title: titleChild.title }])
                })
            
             }
        })

        console.log(myDocs)

      }, [])
    console.log("home page rendering")

    return (
        <div>
            <NavBar></NavBar>
            <Box m={2} pt={3}>
                <Grid container spacing={3}>
                {[...myDocs].map((x, i) =>
                    <Grid item xs={12} key={x.docId}>
                        <Card className={classes.root}>
                        <CardActionArea component={Link} to={`/doc/${x.docId}`}>
                            <CardContent   className={classes.paper}> <AssignmentIcon /> {x.title} </CardContent>
                        </CardActionArea>
                        </Card>
                    </Grid>
                )}
                </Grid>
            </Box>
        </div>
    )
}

export default Home
