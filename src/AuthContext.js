

import React, { useState, useEffect, useRef, useContext } from 'react'
import { auth } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';

const AuthContext = React.createContext();

export function useAuth(){
     return useContext(AuthContext);
}

export const useStyles = makeStyles((theme) => ({
    center: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '500px',
      marginTop: '25px'
    },
    left: {
      width: '40%',
      float: 'left',
      marginTop: '25px'
    },

    right: {
      width: '40%',
      float: 'left',
      border: "1px solid grey",
      borderRadius: '25px',
      marginTop: '25px',
      marginRight: '25px'
    },

    icon: {
      margin: theme.spacing(1),
      width: 60,
      height: 60
    },
    form: {
      width: '60%',
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },

    divider: {
      margin: theme.spacing(3),
    }
  }));

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState("");

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    const value = {
        user,
        openSnackbar,
        setOpenSnackbar,
        message,
        setMessage,
        timeout
    }

    useEffect(() => {
        const cleanup = auth.onAuthStateChanged( (u) => {
            setUser(u);
        })
        return cleanup;
    }, [])
  

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    )

}