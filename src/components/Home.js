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

        firebase.database().ref(`/${user.uid}-docs`).on('child_added', function(data) {
            var childData = data.val();
            if (childData) {
               setMyDocs(arr =>[...arr, childData])
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
                        <CardActionArea>
                            <CardContent className={classes.paper} > <AssignmentIcon /> { x.docId } {x.title} </CardContent>
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
