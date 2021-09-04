
import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import GroupIcon from '@material-ui/icons/Group';
import Divider from '@material-ui/core/Divider';
import { useStyles } from '../AuthContext';
import Share from '@material-ui/icons/Share';


  export default function Intro() {
    const classes = useStyles();

    return (
        <div>
            <Container component="main" maxWidth="lg">

            <div className={classes.center}>

                <NoteAddIcon color='primary' className={classes.icon} /> 
                <Typography component="h1" variant="h5"  >Create a note</Typography>
                <Divider variant="inset" className={classes.divider} />

                <Share color='primary' className={classes.icon}  /> 
                <Typography component="h1" variant="h5"  >Share with someone</Typography>
                <Divider variant="inset" className={classes.divider}/>
                
                <GroupIcon color='primary' className={classes.icon}  /> 
                <Typography component="h1" variant="h5"  >Edit Together</Typography>
                <Divider variant="inset" className={classes.divider}/>
            </div>
        </Container>
      </div>
    );
  }
  