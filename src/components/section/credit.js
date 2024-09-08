import React from 'react';
import './credit.css'; // นำเข้าไฟล์ CSS สำหรับจัดการสไตล์

const Credit = () => {
  return (
    <div className="credit-container">
      <h2>ออกแบบและพัฒนาระบบ</h2>

      <div className="names-container">
        {/* ลิงก์ของแต่ละคน */}
        <a href="https://example.com/person1" className="name" target="_blank" rel="noopener noreferrer">
          นายเกียรติศักดิ์ ศิริเพชร์
        </a>
        <a href="https://example.com/person2" className="name" target="_blank" rel="noopener noreferrer">
          นายศิขรินทร์ รักษาชาติ
        </a>
        <a href="https://example.com/person3" className="name" target="_blank" rel="noopener noreferrer">
          นายศุภณัฐ ขุนนุ้ย
        </a>
        <a href="https://example.com/advisor" className="advisor" target="_blank" rel="noopener noreferrer">
          Advisor : อาจารย์จักริน วีแก้ว
        </a>
      </div>

      <p>
        สาขาวิชาเทคโนโลยีสารสนเทศและนวัตกรรมดิจิทัล สำนักวิชาสารสนเทศศาสตร์
      </p>
      <p>
        ภายใต้การดำเนินโครงงานการพยากรณ์การใช้ไฟฟ้ารายเดือนของหน่วยการศึกษาโดยใช้เทคนิคการทำเหมืองข้อมูล กรณีศึกษา มหาวิทยาลัยวลัยลักษณ์
      </p>
    </div>
  );
};

export default Credit;
