import BASE_URL from "../../api";
import React, { useState, useEffect } from "react";
import "./StatisticElectric.css"; // ไฟล์ CSS สำหรับออกแบบ UI

const StatisticElectric = () => {
  const [sumAmount, setSumAmount] = useState(0);
  const [latestDate, setLatestDate] = useState({ year: "", month: "" });
  const [monthlyData, setMonthlyData] = useState([]);
  useEffect(() => {
    const scrollableElement = document.querySelector('.scrollable');
    if (scrollableElement) {
      scrollableElement.scrollTo({ left: scrollableElement.scrollWidth, behavior: 'smooth' });
    }
  }, [monthlyData]); // เลื่อนการ์ดไปขวาสุดเมื่อข้อมูลโหลดเสร็จ
  
  useEffect(() => {
    const fetchElectricData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/unit`);
        const data = await response.json();

        if (data.length > 0) {
          // หาวันที่ล่าสุดที่มีข้อมูล
          const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.years, a.month - 1);
            const dateB = new Date(b.years, b.month - 1);
            return dateB - dateA;
          });

          const latestYear = sortedData[0].years;
          const latestMonth = sortedData[0].month;

          // รวม amount ของเดือนและปีเดียวกันจากทุกอาคาร
          const sum = sortedData
            .filter((item) => item.years === latestYear && item.month === latestMonth)
            .reduce((total, item) => total + item.amount, 0);

          // จัดกลุ่มข้อมูลตามเดือน
          const groupedMonthlyData = sortedData.reduce((acc, item) => {
            const key = `${item.years}-${item.month}`;
            if (!acc[key]) {
              acc[key] = { year: item.years, month: item.month, amount: 0 };
            }
            acc[key].amount += item.amount;
            return acc;
          }, {});

          const monthlyDataArray = Object.values(groupedMonthlyData)
            .sort((a, b) => {
              // เรียงข้อมูลจากปีและเดือนที่เก่าสุดไปหามากสุด
              const dateA = new Date(a.year, a.month - 1);
              const dateB = new Date(b.year, b.month - 1);
              return dateA - dateB;
            });

          setLatestDate({ year: latestYear, month: latestMonth });
          setSumAmount(sum);
          setMonthlyData(monthlyDataArray); // บันทึกข้อมูลทั้งหมดสำหรับการแสดง card
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchElectricData();
  }, []);

  // ฟังก์ชันสำหรับ format ตัวเลขให้มีจุลภาค
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // ฟังก์ชันแปลงเลขเดือนเป็นชื่อภาษาไทย
  const getThaiMonth = (monthNumber) => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return thaiMonths[monthNumber - 1];
  };

  return (
    <div className="statistic-electric">
      <h2>
        สถิติการใช้ไฟฟ้าประจำเดือน {getThaiMonth(latestDate.month)} {latestDate.year + 543}
      </h2>
      <div className="electric-amount">
        {formatNumber(sumAmount).split("").map((digit, index) => (
          <span key={index} className="digit">{digit}</span>
        ))}
        <span className="unit">Unit</span>
      </div>

      {/* เพิ่ม Card ที่แสดงข้อมูลเดือนอื่นๆ */}
      <div className="scroll-container">
        <button className="scroll-button left" onClick={() => {
          document.querySelector('.scrollable').scrollBy({ left: -200, behavior: 'smooth' });
        }}>{"<"}</button>
        
        <div className="scrollable">
          {monthlyData.map((item, index) => (
            <div key={index} className="card">
              <h3>{getThaiMonth(item.month)} {item.year + 543}</h3>
              <p>{formatNumber(item.amount)} unit</p>
            </div>
          ))}
        </div>

        <button className="scroll-button right" onClick={() => {
          document.querySelector('.scrollable').scrollBy({ left: 200, behavior: 'smooth' });
        }}>{">"}</button>
      </div>
    </div>
  );
};

export default StatisticElectric;
