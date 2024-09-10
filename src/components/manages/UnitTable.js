import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination, Dropdown } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaSort, FaSortUp, FaSortDown, FaPlus, FaFileExcel } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import BASE_URL from "../../api";

const Unit = ({ link }) => {
  const [originalUnitData, setOriginalUnitData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [buildingMap, setBuildingMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [years, setYears] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "years",
    direction: "ascending",
  });

  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const thaiMonths = [
    "ทั้งหมด", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitResponse, buildingResponse] = await Promise.all([
          axios.get(`${BASE_URL}/unit/`),
          axios.get(`${BASE_URL}/buildings/`)
        ]);

        const buildingMap = {};
        buildingResponse.data.forEach(building => {
          buildingMap[building.id] = building.name;
        });

        const unitsWithId = unitResponse.data.map(unit => ({
          ...unit,
          id: unit.id
        }));

        setBuildingMap(buildingMap);
        setOriginalUnitData(unitsWithId);
        setUnitData(unitsWithId);

        const years = [...new Set(unitsWithId.map(unit => convertToBuddhistYear(unit.years)))];
        setUniqueYears(["ทั้งหมด", ...years.sort((a, b) => b - a)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const convertToBuddhistYear = (year) => parseInt(year) + 543;

  const convertMonthToThai = (month) => {
    return thaiMonths[month];
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    filterData(year === "ทั้งหมด" ? "" : year, selectedMonth === "ทั้งหมด" ? "" : selectedMonth);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    filterData(selectedYear === "ทั้งหมด" ? "" : selectedYear, month === "ทั้งหมด" ? "" : month);
  };

  const filterData = (year, month) => {
    let filteredData = [...originalUnitData];

    if (year) {
      filteredData = filteredData.filter(unit => convertToBuddhistYear(unit.years) === parseInt(year));
    }

    if (month) {
      filteredData = filteredData.filter(unit => unit.month === parseInt(month));
    }

    setUnitData(filteredData);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(unitData.map(unit => ({
      ปี: convertToBuddhistYear(unit.years),
      เดือน: convertMonthToThai(unit.month),
      จำนวน: unit.amount,
      อาคาร: buildingMap[unit.idBuilding] || "ไม่ทราบชื่ออาคาร"
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Units");

    XLSX.writeFile(workbook, "UnitData.xlsx");
  };

  const handleShowModal = (type, unit = null) => {
    if (unit) {
      console.log("Selected Unit: ", unit);
    }
    setModalType(type);
    setSelectedUnit(unit);

    if (type === "edit" && unit) {
      setYears(convertToBuddhistYear(unit.years));
      setMonth(unit.month);
      setAmount(unit.amount);
      setBuildingName(unit.idBuilding);
    } else {
      setYears("");
      setMonth("");
      setAmount("");
      setBuildingName("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUnit(null);
    setYears("");
    setMonth("");
    setAmount("");
    setBuildingName("");
  };

  const handleAddUnit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/units/`, {
        years: years - 543,
        month,
        amount,
        idBuilding: buildingName,
      });

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/units/`);
        setOriginalUnitData(fetchData.data);
        setUnitData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEditUnit = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/units/${selectedUnit.id}`, {
        years: years - 543,
        month,
        amount,
        idBuilding: buildingName,
      });

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/unit/`);
        setOriginalUnitData(fetchData.data);
        setUnitData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDeleteUnit = async (unitIds) => {
    try {
      if (!Array.isArray(unitIds)) {
        unitIds = [unitIds];
      }

      await Promise.all(
        unitIds.map((unitId) => axios.delete(`${BASE_URL}/units/${unitId}`))
      );

      const fetchData = await axios.get(`${BASE_URL}/units/`);
      setOriginalUnitData(fetchData.data);
      setUnitData(fetchData.data);
      setSelectedUnits([]);
      handleCloseModal();
      setShowDeleteAllModal(false);
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleCheckboxChange = (unitId) => {
    setSelectedUnits(prevSelected => {
      if (prevSelected.includes(unitId)) {
        return prevSelected.filter(id => id !== unitId);
      } else {
        return [...prevSelected, unitId];
      }
    });
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...unitData].sort((a, b) => {
      if (direction === "ascending") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setUnitData(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <FaSortUp />;
      } else {
        return <FaSortDown />;
      }
    } else {
      return <FaSort />;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = unitData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(unitData.length / itemsPerPage);
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(currentPage - halfMaxPageNumbersToShow, 1);
    let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    pageNumbers.push(
      <Pagination.Prev
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    if (startPage > 1) {
      pageNumbers.push(
        <Pagination.Item key={1} onClick={() => paginate(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageNumbers.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => paginate(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      pageNumbers.push(
        <Pagination.Item key={totalPages} onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    pageNumbers.push(
      <Pagination.Next
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return pageNumbers;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-year">
              {selectedYear ? `ปี ${selectedYear}` : "เลือกปี"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {uniqueYears.map((year) => (
                <Dropdown.Item key={year} onClick={() => handleYearSelect(year)}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-month">
              {selectedMonth ? convertMonthToThai(selectedMonth) : "เลือกเดือน"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {thaiMonths.map((month, index) => (
                <Dropdown.Item key={index} onClick={() => handleMonthSelect(index)}>
                  {month}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="d-flex">
          {selectedUnits.length > 1 && (
            <Button variant="danger" onClick={() => setShowDeleteAllModal(true)} className="me-2">
              ลบทั้งหมด
            </Button>
          )}
          <Link to={ link } className="me-2">
            <Button variant="primary">
              <FaPlus className="me-1" />
              เพิ่มข้อมูล
            </Button>
          </Link>
          <Button variant="success" onClick={exportToExcel}>
            <FaFileExcel className="me-1" /> ดาวน์โหลด Excel
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = currentItems.map((unit) => unit.id);
                    setSelectedUnits(allIds);
                  } else {
                    setSelectedUnits([]);
                  }
                }}
                checked={
                  currentItems.length > 0 && selectedUnits.length === currentItems.length
                }
              />
            </th>
            <th>#</th>
            <th onClick={() => handleSort("years")}>
              ปี {getSortIcon("years")}
            </th>
            <th onClick={() => handleSort("month")}>
              เดือน {getSortIcon("month")}
            </th>
            <th onClick={() => handleSort("amount")}>
              จำนวน (Unit) {getSortIcon("amount")}
            </th>
            <th onClick={() => handleSort("buildingName")}>
              ชื่ออาคาร {getSortIcon("buildingName")}
            </th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((unit, index) => (
            <tr key={unit.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUnits.includes(unit.id)}
                  onChange={() => handleCheckboxChange(unit.id)}
                />
              </td>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{convertToBuddhistYear(unit.years)}</td>
              <td>{convertMonthToThai(unit.month)}</td>
              <td>{unit.amount}</td>
              <td>{buildingMap[unit.idBuilding] || "ไม่ทราบชื่ออาคาร"}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", unit)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", unit)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {unitData.length > itemsPerPage && (
        <Pagination>
          {renderPaginationItems()}
        </Pagination>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add"
              ? "เพิ่มข้อมูล"
              : modalType === "edit"
              ? "แก้ไขข้อมูล"
              : "ลบข้อมูล"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete" ? (
            <p>คุณแน่ใจว่าต้องการลบข้อมูลนี้หรือไม่?</p>
          ) : (
            <Form>
              <Form.Group controlId="formYear">
                <Form.Label>ปี</Form.Label>
                <Form.Control
                  type="text"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="กรอกปี"
                />
              </Form.Group>
              <Form.Group controlId="formMonth">
                <Form.Label>เดือน</Form.Label>
                <Form.Control
                  as="select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {thaiMonths.slice(1).map((monthName, index) => (
                    <option key={index + 1} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>จำนวน (Unit)</Form.Label>
                <Form.Control
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="กรอกจำนวน"
                />
              </Form.Group>
              <Form.Group controlId="formBuildingName">
                <Form.Label>ชื่ออาคาร</Form.Label>
                <Form.Control
                  as="select"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                >
                  {Object.keys(buildingMap).map((id) => (
                    <option key={id} value={id}>
                      {buildingMap[id]}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ยกเลิก
          </Button>
          <Button
            variant={modalType === "delete" ? "danger" : "primary"}
            onClick={
              modalType === "add"
                ? handleAddUnit
                : modalType === "edit"
                ? handleEditUnit
                : () => handleDeleteUnit(selectedUnit.id)
            }
          >
            {modalType === "delete" ? "ลบ" : "บันทึก"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>คุณแน่ใจว่าต้องการลบข้อมูลที่เลือกทั้งหมดหรือไม่?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={() => handleDeleteUnit(selectedUnits)}>
            ลบทั้งหมด
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Unit;