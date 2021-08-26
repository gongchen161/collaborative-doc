import Recat, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import firebase from 'firebase'
import 'react-quill/dist/quill.snow.css';
import '../styles.css'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import TitleIcon from '@material-ui/icons/Title';

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

export default function Document( { sessionId } ) {

    const classes = useStyles();
    const quill = useRef();
    const [text, setText] = useState("");

    const { docId } = useParams();

    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID
    };
    // Initialize Firebase
    useEffect(() => {
    try {
        firebase.initializeApp(firebaseConfig);

        firebase.database().ref(`/${docId}`).on('child_added', function(data) {
            var childData = data.val();
            if (quill && childData.sessionId !== sessionId) {
                const editor = quill.current.getEditor();
                editor.updateContents(childData.delta);
            }
        })
    } catch (e) {

    }
    }, []);

    const uploadChanges = (content, delta, source, editor) => {
        if (source !== 'user') {
            return;
        }
    
        firebase.database().ref(`/${docId}`).push({ sessionId: sessionId , delta : delta } );
    }

    return (
        <div>

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    Collaborative Doc
                    </Typography>
                    <Button color="inherit"> <AccountCircle /></Button>
                </Toolbar>
            </AppBar> 
            

            <TextField
                id="standard-full-width"
                placeholder="   Document Title"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        // Do code here
                       // ev.preventDefault();
                    }
                }}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
            />
        
            <ReactQuill 
                theme="snow"
                value={text}
                onChange={uploadChanges}
                ref={quill}
            />
        </div>
    )

}