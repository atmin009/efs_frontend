import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../api";

const AddUnitTable = () => {
  const [buildingData, setBuildingData] = useState([]);
  const [visibleBuildings, setVisibleBuildings] = useState(10); // เริ่มต้นแสดง 10 แถวแรก
  const [year, setYear] = useState(() => sessionStorage.getItem("year") || ""); // โหลดจาก sessionStorage
  const [month, setMonth] = useState(
    () => sessionStorage.getItem("month") || ""
  ); // โหลดจาก sessionStorage
  const [unitData, setUnitData] = useState(() => {
    const savedData = sessionStorage.getItem("unitData");
    return savedData ? JSON.parse(savedData) : [];
  });

  // ดึงข้อมูลอาคารจาก API
  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/buildings/`);
        console.log("Building data fetched:", response.data);
        setBuildingData(response.data);

        // ตั้งค่าเริ่มต้นแสดง 10 อาคารแรกเมื่อดึงข้อมูลเสร็จ
        if (!sessionStorage.getItem("unitData")) {
          const initialUnitData = response.data
            .slice(0, 10)
            .map((building) => ({
              idBuilding: building.id,
              amount: "",
            }));
          setUnitData(initialUnitData);
        }
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };

    fetchBuildingData();
  }, []);

  // บันทึก unitData, year, month ลงใน Session Storage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    console.log("Unit data updated:", unitData);
    sessionStorage.setItem("unitData", JSON.stringify(unitData));
  }, [unitData]);

  useEffect(() => {
    sessionStorage.setItem("year", year);
    sessionStorage.setItem("month", month);
  }, [year, month]);

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const handleInputChange = (index, field, value) => {
    const updatedData = [...unitData];
    updatedData[index][field] = value;
    setUnitData(updatedData);
  };

  const handleAddRow = () => {
    // เพิ่มแถวใหม่โดยแสดงอาคารถัดไป
    const nextBuilding = buildingData[unitData.length];
    if (nextBuilding) {
      setUnitData([...unitData, { idBuilding: nextBuilding.id, amount: "" }]);
      setVisibleBuildings(visibleBuildings + 1); // เพิ่มจำนวนอาคารที่แสดง
    } else {
      toast.error("ไม่มีอาคารเพิ่มเติมให้แสดงแล้ว");
    }
  };

  const handleDeleteRow = (index) => {
    const updatedData = unitData.filter((_, i) => i !== index);
    setUnitData(updatedData);
  };

  const handleSave = async () => {
    // ตรวจสอบว่ากรอกข้อมูลครบทุกแถวและมีแถวทั้งหมดเท่ากับจำนวนอาคารก่อนบันทึก
    const incompleteRows = unitData.some(
      (unit) => !unit.amount || unit.amount === ""
    );
    if (incompleteRows || unitData.length < buildingData.length) {
      toast.error("กรุณากรอกจำนวนให้ครบทุกแถวสำหรับทุกอาคารก่อนบันทึก");
      return;
    }

    if (!year || !month) {
      toast.error("กรุณาระบุปี และเดือน");
      return;
    }

    // ตรวจสอบว่ามีข้อมูลซ้ำในปีและเดือนนี้หรือไม่ (ปีและเดือนต้องตรงกันทั้งคู่)
    try {
      const existingData = await axios.get(
        `${BASE_URL}/units?year=${year - 543}&month=${month}`
      );
      const duplicate = existingData.data.some(
        (data) =>
          data.years === year - 543 && data.month === parseInt(month, 10)
      );

      if (duplicate) {
        toast.error("มีข้อมูลในเดือนและปีนี้อยู่แล้ว ไม่สามารถบันทึกซ้ำได้");
        return;
      }
    } catch (error) {
      console.error("Error checking for duplicate data:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูลซ้ำ");
      return;
    }

    try {
      const requests = unitData.map((unit) => {
        return axios.post(`${BASE_URL}/units/`, {
          years: year - 543, // แปลงจาก พ.ศ. เป็น ค.ศ.
          month,
          amount: unit.amount,
          idBuilding: unit.idBuilding,
        });
      });

      await Promise.all(requests);

      toast.success("บันทึกข้อมูลสำเร็จ");
      sessionStorage.removeItem("unitData"); // ลบข้อมูลจาก Session Storage หลังบันทึกสำเร็จ
      sessionStorage.removeItem("year");
      sessionStorage.removeItem("month");
      setUnitData(
        buildingData
          .slice(0, 10)
          .map((building) => ({ idBuilding: building.id, amount: "" }))
      ); // รีเซ็ตข้อมูลหลังบันทึก
      setVisibleBuildings(10); // รีเซ็ตจำนวนแถวที่แสดงกลับเป็น 10
      setYear("");
      setMonth("");
    } catch (error) {
      console.error("Error saving unit data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Form.Group controlId="formYear">
            <Form.Label>ปี</Form.Label>

            <Form.Control
              type="text"
              value={year}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d{0,4}$/.test(inputValue)) {
                  setYear(inputValue);
                }
              }}
              placeholder="กรอกปี (พ.ศ.)"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formMonth">
            <Form.Label>เดือน</Form.Label>
            <Form.Control
              as="select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">เลือกเดือน</option>
              {thaiMonths.map((monthName, index) => (
                <option key={index + 1} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <br />
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "60%" }}>ชื่ออาคาร</th>
            <th style={{ width: "20%" }}>จำนวน</th>
            <th style={{ width: "20%" }}>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {buildingData.length > 0 ? (
            unitData.slice(0, visibleBuildings).map((unit, index) => {
              const building = buildingData.find(
                (b) => b.id === unit.idBuilding
              );
              return (
                <tr key={index}>
                  <td>{building ? building.name : "ไม่พบข้อมูลอาคาร"}</td>
                  <td style={{ width: "150px" }}>
                    <Form.Control
                      type="number"
                      value={unit.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      placeholder="กรอกจำนวน"
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mb-3">
        {unitData.length < buildingData.length && (
          <Button variant="success" onClick={handleAddRow} className="me-2">
            <FaPlus className="me-1" />
            เพิ่มอาคาร
          </Button>
        )}
        <Button variant="primary" onClick={handleSave}>
          <FaSave className="me-1" />
          บันทึกข้อมูล
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddUnitTable;
