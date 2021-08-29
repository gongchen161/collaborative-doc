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

import NavBar from './NavBar';
import { useHistory } from 'react-router-dom';
import { CircularProgress, LinearProgress } from '@material-ui/core';
import uuid from 'react-uuid'

export default function Document() {

    const quill = useRef();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("Untitled");
    const { docId } = useParams();
    const [sessionId, setSessionId] = useState(uuid());

    const titleRef = createRef();
    const [disableTitle, setDisableTitle] = useState(false)
    const { user, setOpenSnackbar, setMessage } = useAuth()
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, [])
    
   
    // Initialize Firebase
    useEffect(() => {
        setLoading(true)
        try {

            firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-content`).on('child_added', function(data) {
                console.log("------ fetching content from firebase")
                var childData = data.val();
                if (quill && quill.current && childData.sessionId !== sessionId) {
                    const editor = quill.current.getEditor();
                    editor.updateContents(childData.delta);
                }
            })

            firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-misc`).on('value', function(data){
                console.log("------ fetching title from firebase")
                var childData = data.val();
                setTitle(childData.title);
                
            })
        } catch (e) {
            console.log("error loading from firebse", e)
        }
        setTimeout(() => { setLoading(false) }, 1500);
    }, []);

    const uploadChanges = (content, delta, source, editor) => {
        if (source !== 'user') {
            return;
        }
        console.log("++++++ uploading delta to firebase")
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-content`).push({ sessionId: sessionId , delta : delta } );
    }


    const uploadTitle = (text) => {
        if (!text || text.trim().length === 0) {
            return;
        }
        console.log("++++++ uploading title to firebase")
        firebase.database().ref(process.env.REACT_APP_DB_NAME).child(`/${docId}-misc`).update({title : text});
    }

    return (
        <div>
            
            <NavBar inDoc={true} docId={docId}/>
            <TextField
                id="standard-full-width"
                placeholder="   Document Title"
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
                        // console.log("bluering")
                    }
                }}
                onClick={()=>{
                    setDisableTitle(false)
                }}
                onFocus={()=>{
                    setDisableTitle(false)
                    console.log(22)
                }}
                onBlur={()=>{
                    setDisableTitle(true)
                    console.log(333)
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
            {loading && <div><LinearProgress color='primary'disableShrink size={80} thickness={10} /></div> }

            <ReactQuill 
                theme="snow"
                onChange={uploadChanges}
                readOnly={ loading}
                ref={quill}
            />
        </div>
    )

}