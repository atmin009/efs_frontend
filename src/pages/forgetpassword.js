import React, { useState } from 'react';
import CollapsibleExample from '../components/navmenu'; 
import LoginModal from '../components/modals/login'; // แก้ไขการ import ชื่อซ้ำ
import ForgetpasswordComponent from '../components/modals/Foegetpassword';

const FoegetpasswordPage = () => {
  const [lnShow, setLnShow] = useState(false); // สำหรับ LoginModal

  return (
    <div>
      <CollapsibleExample 
        loginShow={setLnShow}
      />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} />
      <ForgetpasswordComponent/>
    </div>
  );
};

export default FoegetpasswordPage;
