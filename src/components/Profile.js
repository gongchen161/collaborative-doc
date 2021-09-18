import React, { useEffect } from 'react'
import { useAuth } from '../AuthContext';

import NavBar from './NavBar';
import Card from '@material-ui/core/Card';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

function Profile() {

  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login')
      return;
    }
  }, [user])

  return (


    <div>
      <NavBar inUser={true}></NavBar>
      <Card className='center'>
        <AccountCircle color='primary' size={44}> </AccountCircle>
        <Typography>Email: {user.email}</Typography>
      </Card>
    </div>
  )
}

export default Profile
