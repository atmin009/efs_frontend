import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบันมาแสดง

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        Copyright © {currentYear} ระบบการพยากรณ์การใช้ไฟฟ้า มหาวิทยาลัยวลัยลักษณ์
      </p>
      <p style={styles.text}>
        222 มหาวิทยาลัยวลัยลักษณ์ ตำบล ไทยบุรี อำเภอท่าศาลา นครศรีธรรมราช 80160
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#4D0067', // พื้นหลังสี 4D0067
    color: 'white', // อักษรสีขาว
    textAlign: 'center',
    padding: '10px 0',
    fontFamily: '"Anuphan", sans-serif',
    padding: '10px'
  },
  text: {
    margin: '5px 0',
  },
};

export default Footer;
