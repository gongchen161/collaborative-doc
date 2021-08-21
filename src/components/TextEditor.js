import Recat, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import firebase from 'firebase'
import 'react-quill/dist/quill.snow.css';
import '../styles.css'

export default function TextEditor( { sessionId } ) {

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


        // firebase.database().ref("/tesing-node1").once('value', function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //       var childKey = childSnapshot.key;
        //       var childData = childSnapshot.val();
             
        //       console.log(childKey);
        //       console.log(childData.ops);
            
        //       if (quill && childData.sessionId !== sessionId) {
        //         const editor = quill.current.getEditor();
        //         editor.updateContents(childData.delta);
        //       }

        //     });
        //   });


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

        console.log('delta', editor.getContents());
        
        console.log('send-changes');
    
        firebase.database().ref(`/${docId}`).push({ sessionId: sessionId , delta : delta } );
    }

    return (
        <ReactQuill 
            theme="snow"
            value={text}
            onChange={uploadChanges}
            ref={quill}
        />
    )

}