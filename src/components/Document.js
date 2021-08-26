import Recat, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles.css'
import firebase from '../Firebase';

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

import NavBar from './NavBar';


export default function Document( { sessionId } ) {

    const quill = useRef();
    const [text, setText] = useState("");

    const { docId } = useParams();

   
    // Initialize Firebase
    useEffect(() => {
    try {
        console.log("loading changes from firebase")
        firebase.database().ref(`/${docId}`).on('child_added', function(data) {
            var childData = data.val();
            if (quill && childData.sessionId !== sessionId) {
                const editor = quill.current.getEditor();
                editor.updateContents(childData.delta);
            }
        })
    } catch (e) {
        console.log("error loading from firebse", e)
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
            <NavBar />
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