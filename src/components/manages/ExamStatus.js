import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,FaFileExcel
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx'; // นำเข้าไลบรารี xlsx
import BASE_URL from "../../api";
const ExamStatus = () => {
  const [examStatusData, setExamStatusData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // State for delete confirmation modal
  const [modalType, setModalType] = useState("");
  const [selectedExamStatus, setSelectedExamStatus] = useState(null);
  const [years, setYears] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "years",
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState(""); // State for filter dropdown
  const [filterYear, setFilterYear] = useState(""); // State for filtering by year
  const [filterMonth, setFilterMonth] = useState(""); // State for filtering by month
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map((examStatus) => ({
        ปี: convertToBE(examStatus.years),
        เดือน: getThaiMonthName(examStatus.month),
        สถานะ: getStatusLabel(examStatus.status),
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExamStatus");
  
    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(workbook, "ExamStatus.xlsx");
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/examStatus`);
        setExamStatusData(response.data); // ไม่ต้องแปลงปี
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const convertToBE = (yearCE) => yearCE ;

  const getThaiMonthName = (monthNumber) => {
    const months = [
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
    return months[monthNumber - 1];
  };

  const getStatusLabel = (statusValue) => {
    if (typeof statusValue === "boolean") {
      return statusValue ? "สอบ" : "ไม่สอบ";
    }
    return statusValue === 1 ? "สอบ" : "ไม่สอบ";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const uniqueYears = [
    ...new Set(examStatusData.map((item) => item.years)),
  ].sort(
    (a, b) => a - b // เรียงลำดับจากน้อยไปมาก
  );

  const uniqueMonths = [
    ...new Set(examStatusData.map((item) => item.month)),
  ].sort(
    (a, b) => a - b // เรียงลำดับจากน้อยไปมาก
  );

  const filteredData = examStatusData.filter((item) => {
    let matchesStatus =
      filterStatus === "" || item.status === Boolean(parseInt(filterStatus)); // แปลงเป็น Boolean
    let matchesYear = filterYear === "" || item.years === parseInt(filterYear);
    let matchesMonth =
      filterMonth === "" || item.month === parseInt(filterMonth);
    return matchesStatus && matchesYear && matchesMonth;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    } else {
      return <FaSort />;
    }
  };

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];

    // Previous button
    pageNumbers.push(
      <Pagination.Prev
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => paginate(i)}
          >
            {i}
          </Pagination.Item>
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push(<Pagination.Ellipsis key={`ellipsis-${i}`} />);
      }
    }

    // Next button
    pageNumbers.push(
      <Pagination.Next
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return pageNumbers;
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      for (const id of selectedRows) {
        await axios.delete(`${BASE_URL}/examStatus/${id}`);
      }
      const fetchData = await axios.get(`${BASE_URL}/examStatus`);
      setExamStatusData(fetchData.data);
      setSelectedRows([]); // Clear selection after delete
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleShowModal = (type, examStatus = null) => {
    setModalType(type);
    setSelectedExamStatus(examStatus);

    if (type === "edit" && examStatus) {
      setYears(examStatus.years);
      setMonth(examStatus.month);
      setStatus(examStatus.status.toString()); // แปลงเป็น string
    } else {
      setYears("");
      setMonth("");
      setStatus("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExamStatus(null);
    setYears("");
    setMonth("");
    setStatus("");
  };

  const handleAddExamStatus = async () => {
    try {
      const yearCE = parseInt(years) - 543; // แปลงปี พ.ศ. เป็น ค.ศ.
  
      // ตรวจสอบว่ามีข้อมูลในปีและเดือนนี้อยู่แล้วหรือไม่
      const existingExamStatus = examStatusData.find(
        (item) => item.years === yearCE && item.month === parseInt(month)
      );
  
      if (existingExamStatus) {
        toast.warning("ข้อมูลซ้ำ: มีข้อมูลในเดือนและปีนี้อยู่แล้ว");
        return;
      }
  
      const requestData = {
        years: yearCE,
        month: parseInt(month),
        status: Boolean(parseInt(status)), // แปลงกลับเป็น boolean
      };
  
      const response = await axios.post(
        `${BASE_URL}/examStatus`,
        requestData
      );
  
      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/examStatus`);
        setExamStatusData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  
  

  const handleEditExamStatus = async () => {
    if (!selectedExamStatus || !selectedExamStatus.id) {
      toast.error("ไม่สามารถแก้ไขข้อมูลได้เนื่องจากข้อมูลไม่ถูกต้อง");
      return;
    }
  
    try {
      const requestData = {
        years: parseInt(years), // ใช้ปี พ.ศ. ตรงๆ
        month: parseInt(month),
        status: status === "1",
      };
  
      const response = await axios.put(
        `${BASE_URL}/examStatus/${selectedExamStatus.id}`,
        requestData
      );
  
      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/examStatus`);
        setExamStatusData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        // แสดงข้อความ Toast ตามที่ได้จาก Backend
        toast.warning(error.response.data.detail);
      } else {
        console.error("Error updating data:", error);
        toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      }
    }
  };
  
  const handleDeleteExamStatus = async () => {
    if (!selectedExamStatus || !selectedExamStatus.id) {
      toast.error("ไม่สามารถลบข้อมูลได้เนื่องจากข้อมูลไม่ถูกต้อง");
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/examStatus/${selectedExamStatus.id}`
      );

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/examStatus`);
        setExamStatusData(fetchData.data);
        handleCloseModal();
        toast.success("ลบข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex align-items-center col-auto">
            <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
              ปี (พ.ศ.)
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                as="select"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="form-select"
                style={{ paddingRight: "30px" }} // Extra space for the icon
              >
                <option value="">ทั้งหมด</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {convertToBE(year)}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="d-flex align-items-center col-auto">
            <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
              เดือน
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                as="select"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="form-select"
                style={{ paddingRight: "30px" }} // Extra space for the icon
              >
                <option value="">ทั้งหมด</option>
                {uniqueMonths.map((month) => (
                  <option key={month} value={month}>
                    {getThaiMonthName(month)}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="d-flex align-items-center col-auto">
            <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
              สถานะการสอบ
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                as="select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
                style={{ paddingRight: "30px" }} // Extra space for the icon
              >
                <option value="">ทั้งหมด</option>
                <option value="0">ไม่สอบ</option>
                <option value="1">สอบ</option>
              </Form.Control>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          {selectedRows.length > 1 && (
            <Button
              variant="danger"
              onClick={() => setShowDeleteAllModal(true)}
            >
              <FaTrashAlt className="me-1" />
              ลบทั้งหมด
            </Button>
          )}
          <Button variant="primary" onClick={() => handleShowModal("add")}>
            <FaPlus className="me-1" />
            เพิ่มข้อมูล
          </Button>
          <Button variant="success" className="ms-2" onClick={exportToExcel}>
  <FaFileExcel className="me-1" /> ดาวน์โหลด Excel
</Button>

        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={
                  selectedRows.length === currentItems.length &&
                  selectedRows.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(currentItems.map((item) => item.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </th>
            <th onClick={() => handleSort("years")}>
              ปี (พ.ศ.) {getSortIcon("years")}
            </th>
            <th onClick={() => handleSort("month")}>
              เดือน {getSortIcon("month")}
            </th>
            <th onClick={() => handleSort("status")}>
              สถานะ {getSortIcon("status")}
            </th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((examStatus) => (
            <tr key={examStatus.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(examStatus.id)}
                  onChange={() => handleSelectRow(examStatus.id)}
                />
              </td>
              <td>{convertToBE(examStatus.years)}</td>
              <td>{getThaiMonthName(examStatus.month)}</td>
              <td>{getStatusLabel(examStatus.status)}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", examStatus)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", examStatus)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {sortedData.length > itemsPerPage && (
        <Pagination>{renderPaginationItems()}</Pagination>
      )}
      {/* Main Modal */}
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
              <Form.Group controlId="formYears">
                <Form.Label>ปี (พ.ศ.)</Form.Label>
                <Form.Control
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="กรอกปี (พ.ศ.)"
                />
              </Form.Group>
              <Form.Group controlId="formMonth">
                <Form.Label>เดือน</Form.Label>
                <Form.Control
                  as="select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">เลือกเดือน</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {getThaiMonthName(month)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>สถานะ</Form.Label>
                <Form.Control
                  as="select"
                  value={status.toString()} // แปลงเป็น string
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="0">ไม่สอบ</option>
                  <option value="1">สอบ</option>
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
                ? handleAddExamStatus
                : modalType === "edit"
                ? handleEditExamStatus
                : handleDeleteExamStatus
            }
          >
            {modalType === "delete" ? "ลบ" : "บันทึก"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteAllModal}
        onHide={() => setShowDeleteAllModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณแน่ใจว่าต้องการลบข้อมูลที่เลือกหรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteAllModal(false)}
          >
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteMultiple();
              setShowDeleteAllModal(false);
            }}
          >
            ลบทั้งหมด
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer /> {/* Container สำหรับการแสดงการแจ้งเตือน */}
    </div>
  );
};

export default ExamStatus;
