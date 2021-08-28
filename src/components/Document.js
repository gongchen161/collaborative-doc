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

export default function Document( { sessionId } ) {

    const quill = useRef();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const { docId } = useParams();

    const titleRef = createRef();
    const [disableTitle, setDisableTitle] = useState(false)
    const { user } = useAuth()
    const history = useHistory();
    
    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, [])
    
   
    // Initialize Firebase
    useEffect(() => {
    try {
        console.log("loading changes from firebase")
        firebase.database().ref(`/${docId}-content`).on('child_added', function(data) {
            var childData = data.val();
            if (quill && childData.sessionId !== sessionId) {
                const editor = quill.current.getEditor();
                editor.updateContents(childData.delta);
            }
        })

        firebase.database().ref(`/${docId}-title`).limitToLast(1).on('child_added', function(data) {
            var childData = data.val();
            if (childData.sessionId !== sessionId) {
                setTitle(childData.title);
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
    
        firebase.database().ref(`/${docId}-content`).push({ sessionId: sessionId , delta : delta } );
    }


    const uploadTitle = (text) => {
        firebase.database().ref(`/${docId}-title`).push({ sessionId: sessionId , title : text } );
    }

    return (
        <div>
            <NavBar />
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
                disabled={disableTitle}
                readOnly={true}
                autoFocus={true}
                onChange={(e)=>{
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
        
            <ReactQuill 
                theme="snow"
                onChange={uploadChanges}
                ref={quill}
            />
        </div>
    )

}