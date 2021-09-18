
import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NavBar from './NavBar';
import Intro from './Intro'
import { auth } from '../Firebase';

import { useAuth, useStyles } from '../AuthContext';

import { useHistory } from 'react-router-dom';



export default function Login() {
    const classes = useStyles();

    const emailRef = useRef();
    const passwordRef = useRef();

    const history = useHistory();

    const { setOpenSnackbar, setMessage, user } = useAuth()

    useEffect(() => {
        if (user) {
            history.push('/home')
        }
    }, [])
    const login = async (e) => {
        e.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
            history.push('/home')
        } catch (e) {
            setMessage(e.message);
            setOpenSnackbar(true);
        }
    }

    return (
        <div>

            <NavBar />
            <div className={classes.left}>
                <Intro />
            </div>
            <div className={classes.right}>
                <Container component="main" maxWidth="lg">
                    <div className={classes.center}>
                        <AccountCircleIcon className={classes.icon} color='primary' />
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
                                onClick={login}
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
        </div>
    );
}
