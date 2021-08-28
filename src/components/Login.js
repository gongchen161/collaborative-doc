
import React, { useRef, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import NavBar from './NavBar';

import { auth } from '../Firebase';

import { useAuth } from '../AuthContext';

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.dark
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  export default function Login() {
    const classes = useStyles();
  
    const emailRef = useRef();
    const passwordRef = useRef();

    const history = useHistory();

    const { setOpenSnackbar, setMessage, user } = useAuth()

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
      }, [])
    const login = async (e) => {
        e.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
            history.push('/home')
        } catch (e) {
            console.log(e);
            setMessage(e.message);
            setOpenSnackbar(true);
        }
    }

    return (
        <div>

            <NavBar />
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                    <Avatar className={classes.icon}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            inputRef={emailRef}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={passwordRef}
                            />
                        </Grid>
                        </Grid>
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={ login }
                        >
                        Log In
                        </Button>
                        <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#/signup" variant="body2">
                            Don't have an account? Sign up
                            </Link>
                        </Grid>
                        </Grid>
                    </form>
                    </div>
                </Container>
      </div>
    );
  }
  