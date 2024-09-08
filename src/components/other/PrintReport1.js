// PrintReport1.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../fonts/THSarabunNew-normal.ttf'; // โหลดฟอนต์ THSarabunNew
import BASE_URL from '../../api';
const PrintReport1 = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  // ดึงข้อมูลจาก API
  useEffect(() => {
    axios.get(`${BASE_URL}/unit/`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  // ฟิลเตอร์ข้อมูลตามปีที่เลือก
  useEffect(() => {
    if (selectedYear) {
      const filtered = data.filter(item => item.years === parseInt(selectedYear, 10));
      setFilteredData(filtered);
    }
  }, [selectedYear, data]);

  // แปลงปีเป็น พ.ศ.
  const convertToBuddhistYear = (year) => {
    return year + 543;
  };

  // ฟังก์ชันสำหรับสร้าง PDF รองรับภาษาไทย
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // ตั้งค่าฟอนต์เป็น THSarabunNew
    doc.setFont("THSarabunNew", "normal");

    const tableColumn = ["เดือน", "ปี (พ.ศ.)", "ค่ารวม (บาท)"];
    const tableRows = [];

    filteredData.forEach(item => {
      const rowData = [
        thaiMonths[item.month - 1],
        convertToBuddhistYear(item.years),
        item.amount
      ];
      tableRows.push(rowData);
    });

    doc.text(`รายงานการใช้ไฟฟ้า ประจำปี ${convertToBuddhistYear(selectedYear)}`, 14, 10);
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save(`รายงานการใช้ไฟฟ้า_${selectedYear}.pdf`);
  };

  // ฟังก์ชันสำหรับสร้างไฟล์ XLSX
  const generateXLSX = () => {
    const worksheetData = filteredData.map(item => ({
      เดือน: thaiMonths[item.month - 1],
      ปี: convertToBuddhistYear(item.years),
      ค่ารวม: item.amount
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานการใช้ไฟฟ้า");
    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([xlsxData], { type: 'application/octet-stream' }), `รายงานการใช้ไฟฟ้า_${selectedYear}.xlsx`);
  };

  return (
    <div>
      <h1>รายงานการใช้ไฟฟ้า</h1>

      {/* Dropdown สำหรับเลือกปี */}
      <label htmlFor="yearSelect">เลือกปี: </label>
      <select id="yearSelect" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="">เลือกปี</option>
        {[...new Set(data.map(item => item.years))].map(year => (
          <option key={year} value={year}>
            {convertToBuddhistYear(year)}
          </option>
        ))}
      </select>

      {/* ตารางแสดงข้อมูล */}
      {filteredData.length > 0 && (
        <div>
          <h2>รายงานการใช้ไฟฟ้า ประจำปี {convertToBuddhistYear(selectedYear)}</h2>
          <table border="1">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>ปี (พ.ศ.)</th>
                <th>ค่ารวม (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>{thaiMonths[item.month - 1]}</td>
                  <td>{convertToBuddhistYear(item.years)}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ปุ่มสำหรับพิมพ์และดาวน์โหลด PDF หรือ Excel */}
          <button onClick={generatePDF}>ดาวน์โหลด PDF</button>
          <button onClick={generateXLSX}>ดาวน์โหลด Excel</button>
        </div>
      )}
    </div>
  );
};

export default PrintReport1;
