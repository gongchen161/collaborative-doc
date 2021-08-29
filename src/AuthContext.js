

import React, { useState, useEffect, useRef, useContext } from 'react'
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { auth } from './Firebase';
import uuid from 'react-uuid'

const AuthContext = React.createContext();

export function useAuth(){
     return useContext(AuthContext);
}

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