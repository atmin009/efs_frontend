import React from 'react';
import './credit.css'; // นำเข้าไฟล์ CSS สำหรับจัดการสไตล์

const Credit = () => {
  return (
    <div className="credit-container">
      <h3>ออกแบบและพัฒนาระบบ</h3>

      <div className="names-container">
        {/* ลิงก์ของแต่ละคนในรูปแบบ Badge */}
        <a href="https://www.facebook.com/profile.php?id=100014703905903" className="badge badge-blog" target="_blank" rel="noopener noreferrer">
          นายเกียรติศักดิ์ ศิริเพชร์
        </a>
        <a href="https://www.facebook.com/profile.php?id=100010020285276" className="badge badge-portfolio" target="_blank" rel="noopener noreferrer">
          นายศิขรินทร์ รักษาชาติ
        </a>
        <a href="https://www.facebook.com/min519" className="badge badge-playstore" target="_blank" rel="noopener noreferrer">
          นายศุภณัฐ ขุนนุ้ย
        </a>
        <a href="https://rps.wu.ac.th/researchersInfo/45" className="badge badge-advisor" target="_blank" rel="noopener noreferrer">
          Advisor : อาจารย์จักริน วีแก้ว
        </a>
      </div>

      <p href="https://www.facebook.com/it.walailak"  target="_blank">
        สาขาวิชาเทคโนโลยีสารสนเทศและนวัตกรรมดิจิทัล สำนักวิชาสารสนเทศศาสตร์
      </p>
      <p className='magin1'>
        ภายใต้การดำเนินโครงงานการพยากรณ์การใช้ไฟฟ้ารายเดือนของหน่วยการศึกษาโดยใช้เทคนิคการทำเหมืองข้อมูล กรณีศึกษา มหาวิทยาลัยวลัยลักษณ์
      </p>
    </div>
  );
};

export default Credit;