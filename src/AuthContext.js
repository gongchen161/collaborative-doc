

import React, { useState, useEffect, useRef, useContext } from 'react'

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
    const value = {
        user,
        openSnackbar,
        setOpenSnackbar,
        message,
        setMessage,
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