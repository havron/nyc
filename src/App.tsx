import React from 'react';
import './css/App.css';
import SubwayRidership from './components/SubwayRidership';
import { Box, Card } from '@mui/material';

function App() {
  return (
    <>
    {/* <Box sx={{ width: "100%", height: "100%" }}> */}
    <Box sx={{m: 4, p: 1 }} >
      <Card variant='outlined'>
        <h1>NYC</h1>
        <p>Small app for exploring new york</p>
      </Card>
      <br />
      <SubwayRidership />
    </Box>
    </>
  )
}

export default App;
