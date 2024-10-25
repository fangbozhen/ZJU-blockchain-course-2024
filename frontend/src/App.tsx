import React, { useState } from 'react';
import HouseList from './components/DisplayHouse';
import { Container } from '@mui/material';
import AppBar from './components/AppBar';
import MyHouses from './components/MyHouses';
import UserInfo from './components/UserInfo';


function App() {
  const [curPage, setCurPage] = useState("Houses");
  
  const isDisplayHouse = curPage === "Houses";
  const isMyHouses = curPage === "MyHouses"; 
  const isUseInfo = curPage === "UserInfo";

  return (
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <AppBar setCurPage={setCurPage}/>
        {isDisplayHouse && <HouseList />}
        {isMyHouses && <MyHouses setCurPage={setCurPage}/>}
        {isUseInfo && <UserInfo />}
      </Container>
    
    
  );
}

export default App;
