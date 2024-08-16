import React, { useState } from 'react';
import CollapsibleExample from '../components/navmenu'; 
import UncontrolledExample from '../components/cover'; 
import LoginModal from '../components/modals/login'; // แก้ไขการ import ชื่อซ้ำ

const HomePage = () => {
  const [lnShow, setLnShow] = useState(false); // สำหรับ LoginModal

  return (
    <div>
      <CollapsibleExample 
        loginShow={setLnShow} // ส่ง loginShow เป็น prop ไปยัง CollapsibleExample
      />
      <UncontrolledExample />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} /> {/* เพิ่ม LoginModal */}
    </div>
  );
};

export default HomePage;
