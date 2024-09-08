import React, { useState, useEffect } from 'react';
import './aboutsys.css';
import Lottie from 'react-lottie-player'; // นำเข้าคอมโพเนนต์ LottiePlayer

const Aboutsys = () => {
  const [aboutIcon, setAboutIcon] = useState(null); // สร้าง state เพื่อเก็บข้อมูล JSON

  useEffect(() => {
    // ใช้ fetch เพื่อดึงข้อมูลจาก aboutIcon.json ที่อยู่ในโฟลเดอร์ public
    fetch('/aboutIcon.json')
      .then((response) => response.json())
      .then((data) => setAboutIcon(data)); // เก็บข้อมูลที่ได้ใน state
  }, []);

  // ถ้า JSON ยังโหลดไม่เสร็จให้แสดง "Loading..."
  if (!aboutIcon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="section2-container3">
      {/* คอลัมน์ซ้าย: เนื้อหาและ Lottie Animation */}
      <div className="section2-content3">
        <div className="header1">
          <Lottie
            loop
            animationData={aboutIcon} // ใช้ข้อมูล JSON ที่ได้จาก state
            play
            style={{ width: 50, height: 50 }} // ขนาดของไอคอน Lottie
          />
          <h3>เกี่ยวกับระบบ</h3>
        </div>
        <p>
          ระบบพยากรณ์การใช้ไฟฟ้าของมหาวิทยาลัยวลัยลักษณ์ถูกพัฒนาขึ้นโดยใช้โมเดลการเรียนรู้ของเครื่องแบบ GradientBoostingRegressor ซึ่งเป็นหนึ่งในเทคนิคที่มีประสิทธิภาพสูงในตระกูลการเรียนรู้แบบเสริมกำลัง (Boosting) กระบวนการทำงานของโมเดลนี้เริ่มจากการสร้างต้นไม้ตัดสินใจต้นแรกเพื่อทำนายค่า จากนั้นจะค่อยๆ เพิ่มโมเดลใหม่ที่เน้นการแก้ไขข้อผิดพลาดของโมเดลก่อนหน้าในแต่ละรอบการเรียนรู้ ทำให้โมเดลสุดท้ายมีความแม่นยำมากขึ้นเรื่อยๆ
        </p>
        <p>
          การนำ GradientBoostingRegressor มาใช้ในการพยากรณ์การใช้ไฟฟ้า ทำให้สามารถทำนายการใช้พลังงานได้อย่างมีประสิทธิภาพ แม้ว่าข้อมูลการใช้พลังงานจะมีความผันผวนในแต่ละช่วงเวลา โมเดลนี้สามารถจัดการกับข้อมูลที่มีความซับซ้อนได้ดี ด้วยการค่อยๆ ปรับปรุงโมเดลแต่ละรอบให้แม่นยำยิ่งขึ้นด้วยแนวทางนี้ ระบบสามารถช่วยลดข้อผิดพลาดในการคาดการณ์การใช้ไฟฟ้า สนับสนุนการบริหารจัดการพลังงานให้มีประสิทธิภาพสูงสุดแก่มหาวิทยาลัย
        </p>
      </div>

      {/* คอลัมน์ขวา: แทรกภาพ .gif */}
      <div className="section2-image">
        <img src="process.gif" alt="New Gif" className="new-image" />
      </div>
    </div>
  );
};

export default Aboutsys;
