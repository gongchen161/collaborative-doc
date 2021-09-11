import Recat, { useState, useEffect, useRef, createRef } from 'react'
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
import { useAuth } from '../AuthContext';
import ErrorIcon from '@material-ui/icons/Error';

import NavBar from './NavBar';
import { useHistory } from 'react-router-dom';
import { CircularProgress, LinearProgress } from '@material-ui/core';
import uuid from 'react-uuid'
import SHA256 from "crypto-js/sha256";
import { IsoTwoTone } from '@material-ui/icons';

export default function Note() {

    const quill = useRef();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("Untitled");
    const { noteId } = useParams();
    const [sessionId, setSessionId] = useState(uuid());

    const [isAuthorized, setIsAuthorized] = useState(0);

    const titleRef = createRef();
    const [disableTitle, setDisableTitle] = useState(false)
    const { user, setOpenSnackbar, setMessage, timeout } = useAuth()
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, [])
    
   
    // Initialize Firebase
    useEffect( async () => {
        setLoading(true)
        setIsAuthorized(0)
        try {
            let result = 0;
            await firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${SHA256(user.email)}-user`).on('child_added', function(data) {
                var childData = data.val();
                if (childData && childData.noteId === noteId) {
                    result = 1;
                }
    
            })

          
            if (result !== 1) {
                result = 2;
            }

            setIsAuthorized(result);

            if (result === 2) {
                return;
            }



             firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-content`).on('child_added', function(data) {
                var childData = data.val();
                if (quill && quill.current && childData.sessionId !== sessionId) {
                    const editor = quill.current.getEditor();
                    editor.updateContents(childData.delta);
                }
            })

             firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-misc`).on('value', function(data){
                var childData = data.val();
                setTitle(childData.title);
                
            })
        } catch (e) {
        }

        setTimeout( () => setLoading(false), 1000);
    }, []);

    const uploadChanges = (content, delta, source, editor) => {
        if (source !== 'user') {
            return;
        }
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-content`).push({ sessionId: sessionId , delta : delta } );
    }


    const uploadTitle = (text) => {
        if (!text || text.trim().length === 0) {
            return;
        }
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${noteId}-misc`).update({title : text});
    }

    return (
        <div>
            
            <NavBar inNote={true} noteId={noteId} inUser={true} canShare={isAuthorized=== 1}/>
            { isAuthorized === 0 && <div className='center'><CircularProgress color='primary'size={60} /><Typography variant="h5">Loading Notes...</Typography></div> }
            {  isAuthorized === 2 && <div className='center'><ErrorIcon color='primary'size={60} /><Typography variant="h5">You cannot view this note</Typography></div> }
            { user && isAuthorized === 1 && <div>
                <TextField
                    id="standard-full-width"
                    placeholder="   Note Title"
                    fullWidth
                    value={title}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputRef={titleRef}
                    disabled={disableTitle || loading}
                    readOnly={true}
                    onChange={(e)=>{
                        if (e.target.value.trim().length === 0) {
                            setOpenSnackbar(true);
                            setMessage("Title cannot be empty");
                            return;
                        }
                        setTitle(e.target.value);
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            titleRef.current.blur();
                            setDisableTitle(true);
                        // setTitle(titleRef.current.value)
                            uploadTitle(titleRef.current.value)
                        }
                    }}
                    onClick={()=>{
                        setDisableTitle(false)
                    }}
                    onFocus={()=>{
                        setDisableTitle(false)
                    }}
                    onBlur={()=>{
                        setDisableTitle(true)
                        // setTitle(titleRef.current.value)
                        uploadTitle(titleRef.current.value)
                    }

                    }
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <TitleIcon />
                        </InputAdornment>
                        ),
                    }}
                />
                {loading && <div><LinearProgress color='primary' size={80} thickness={10} /></div> }

                { user && <ReactQuill 
                    theme="snow"
                    onChange={uploadChanges}
                    readOnly={ loading}
                    ref={quill}
                />}
            </div> }
        </div>
    )

}