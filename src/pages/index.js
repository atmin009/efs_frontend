import React, { useState } from 'react';
import CollapsibleExample from '../components/navmenu'; 
import UncontrolledExample from '../components/cover'; 
import LoginModal from '../components/modals/login';

const HomePage = () => {
  const [lnShow, setLnShow] = useState(false);

  return (
    <div>
      <CollapsibleExample 
        loginShow={setLnShow} 
      />
      <UncontrolledExample />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} /> 
    </div>
  );
};

export default HomePage;
