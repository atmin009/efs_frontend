import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../api";
const AddUnitTable = () => {
  const [buildingData, setBuildingData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [unitData, setUnitData] = useState([
    { idBuilding: "", amount: "" },
    { idBuilding: "", amount: "" },
    { idBuilding: "", amount: "" },
    { idBuilding: "", amount: "" },
    { idBuilding: "", amount: "" },
  ]);

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/buildings/`);
        setBuildingData(response.data);
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };

    fetchBuildingData();
  }, []);

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

  const handleAddRow = () => {
    setUnitData([...unitData, { idBuilding: "", amount: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...unitData];
    updatedData[index][field] = value;
    setUnitData(updatedData);
  };

  const handleDeleteRow = (index) => {
    const updatedData = unitData.filter((_, i) => i !== index);
    setUnitData(updatedData);
  };

  const handleSave = async () => {
    if (!year || !month || unitData.length === 0) {
      toast.error("กรุณาระบุปี, เดือน และข้อมูลอย่างน้อยหนึ่งแถว");
      return;
    }

    const invalidUnits = unitData.some(
      (unit) => !unit.idBuilding || !unit.amount
    );
    if (invalidUnits) {
      toast.error("กรุณากรอกข้อมูลอาคารและจำนวนให้ครบถ้วน");
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
      setUnitData([{ idBuilding: "", amount: "" }]); // ล้างข้อมูลหลังจากบันทึกสำเร็จ
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
              onChange={(e) => setYear(e.target.value)}
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
      <br></br>
      <hr></hr>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th style={{ width: "60%" }}>ชื่ออาคาร</th>
      <th style={{ width: "20%" }}>จำนวน</th>
      <th style={{ width: "20%" }}>การดำเนินการ</th>
    </tr>
  </thead>
  <tbody>
    {unitData.map((unit, index) => (
      <tr key={index}>
        <td>
          <Form.Control
            as="select"
            value={unit.idBuilding}
            onChange={(e) => handleInputChange(index, "idBuilding", e.target.value)}
          >
            <option value="">เลือกอาคาร</option>
            {buildingData.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </Form.Control>
        </td>
        <td style={{ width: "150px" }}>
          <Form.Control
            type="number"
            value={unit.amount}
            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
            placeholder="กรอกจำนวน"
          />
        </td>
        <td style={{ textAlign: "center" }}>
          <Button variant="danger" onClick={() => handleDeleteRow(index)}>
            <FaTrashAlt />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      <div className="d-flex justify-content-center mb-3">
        <Button variant="success" onClick={handleAddRow} className="me-2">
          <FaPlus className="me-1" />
          เพิ่มแถวข้อมูล
        </Button>

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
