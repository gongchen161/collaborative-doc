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
import { Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

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

function Profile() {

    const { user } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const [myDocs, setMyDocs] = useState([]);

    useEffect(() => {
        if (!user) {
            history.push('/login')
            return;
        }
      }, [])

    return (
       

        <div>
            <NavBar inUser={true}></NavBar>
                <Card className='center'>
                    <AccountCircle color='primary' size={44}> </AccountCircle>
                    <Typography>Email: {user.email}</Typography>
                </Card>
        </div>
    )
}

export default Profile
