import NavBar from './NavBar';
import { CircularProgress, Typography } from '@material-ui/core';


function Loading() {
    return (
        <div>
            <NavBar />
            <div className='center'><CircularProgress color='primary' size={60} /><Typography variant="h5">Loading Notes...</Typography></div>
        </div>
    )
}

export default Loading
