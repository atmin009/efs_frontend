import BASE_URL from "../../api";
import React, { useState, useEffect } from 'react';
import './StatisticElectric.css'; // สร้างไฟล์ CSS สำหรับออกแบบ UI

const StatisticElectric = () => {
  const [sumAmount, setSumAmount] = useState(0);
  const [latestDate, setLatestDate] = useState({ year: '', month: '' });

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
            .filter(item => item.years === latestYear && item.month === latestMonth)
            .reduce((total, item) => total + item.amount, 0);

          setLatestDate({ year: latestYear, month: latestMonth });
          setSumAmount(sum);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchElectricData();
  }, []);

  // ฟังก์ชันสำหรับ format ตัวเลขให้มีจุลภาค
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // ฟังก์ชันแปลงเลขเดือนเป็นชื่อภาษาไทย
  const getThaiMonth = (monthNumber) => {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return thaiMonths[monthNumber - 1];
  };

  return (
    <div className="statistic-electric">
      <h2>สถิติการใช้ไฟฟ้าประจำเดือน {getThaiMonth(latestDate.month)} {latestDate.year+543}</h2>
      <div className="electric-amount">
        {formatNumber(sumAmount).split('').map((digit, index) => (
          <span key={index} className="digit">{digit}</span>
        ))}
        <span className="unit">Unit</span>
      </div>
    </div>
  );
};

export default StatisticElectric;
