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
const SemesterStatus = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // State for delete confirmation modal
  const [modalType, setModalType] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
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
      sortedData.map((semester) => ({
        ปี: convertToBE(semester.years),
        เดือน: getThaiMonthName(semester.month),
        สถานะ: getStatusLabel(semester.status),
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SemesterStatus");
  
    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(workbook, "SemesterStatus.xlsx");
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/semesterstatus`
        );
        setSemesterData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const convertToBE = (yearCE) => yearCE + 543;

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
    return statusValue === 1 ? "เปิดเรียน" : "ปิดเรียน";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const uniqueYears = [...new Set(semesterData.map((item) => item.years))].sort(
    (a, b) => b - a
  );
  const uniqueMonths = [...new Set(semesterData.map((item) => item.month))];

  const filteredData = semesterData.filter((item) => {
    let matchesStatus =
      filterStatus === "" || item.status === parseInt(filterStatus);
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
  

// จากนั้นแบ่งหน้าจากข้อมูลที่ถูกเรียงลำดับแล้ว
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
        await axios.delete(`${BASE_URL}/semesterstatus/${id}`);
      }
      const fetchData = await axios.get(`${BASE_URL}/semesterstatus`);
      setSemesterData(fetchData.data);
      setSelectedRows([]); // Clear selection after delete
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleShowModal = (type, semester = null) => {
    setModalType(type);
    setSelectedSemester(semester);

    if (type === "edit" && semester) {
      setYears(semester.years);
      setMonth(semester.month);
      setStatus(semester.status);
    } else {
      setYears("");
      setMonth("");
      setStatus("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSemester(null);
    setYears("");
    setMonth("");
    setStatus("");
  };

  const handleAddSemester = async () => {
    try {
      const yearCE = parseInt(years) - 543; // Convert to CE

      // Check if the combination of year and month already exists
      const existingSemester = semesterData.find(
        (item) => item.years === yearCE && item.month === parseInt(month)
      );

      if (existingSemester) {
        toast.warning("ข้อมูลปีและเดือนนี้มีอยู่แล้ว");
        return;
      }

      const requestData = {
        years: yearCE,
        month: parseInt(month),
        status: parseInt(status),
      };

      const response = await axios.post(
        `${BASE_URL}/semesterstatus`,
        requestData
      );

      if (response.data) {
        const fetchData = await axios.get(
          `${BASE_URL}/semesterstatus`
        );
        setSemesterData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEditSemester = async () => {
    try {
      const yearCE = parseInt(years) - 543; // Convert to CE

      const requestData = {
        years: yearCE,
        month: parseInt(month),
        status: parseInt(status),
      };

      const response = await axios.put(
        `${BASE_URL}/semesterstatus/${selectedSemester.id}`,
        requestData
      );

      if (response.data) {
        const fetchData = await axios.get(
          `${BASE_URL}/semesterstatus`
        );
        setSemesterData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDeleteSemester = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/semesterstatus/${selectedSemester.id}`
      );

      if (response.data) {
        const fetchData = await axios.get(
          `${BASE_URL}/semesterstatus`
        );
        setSemesterData(fetchData.data);
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
    <Form.Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>ปี (พ.ศ.)</Form.Label>
    <div className="position-relative">
      <Form.Control
        as="select"
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="form-select"
        style={{ paddingRight: '30px' }} // Extra space for the icon
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
    <Form.Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>เดือน</Form.Label>
    <div className="position-relative">
      <Form.Control
        as="select"
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="form-select"
        style={{ paddingRight: '30px' }} // Extra space for the icon
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
    <Form.Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>สถานะเปิดเรียน</Form.Label>
    <div className="position-relative">
      <Form.Control
        as="select"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="form-select"
        style={{ paddingRight: '30px' }} // Extra space for the icon
      >
        <option value="">ทั้งหมด</option>
        <option value="0">ปิดเรียน</option>
        <option value="1">เปิดเรียน</option>
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
          {currentItems.map((semester) => (
            <tr key={semester.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(semester.id)}
                  onChange={() => handleSelectRow(semester.id)}
                />
              </td>
              <td>{convertToBE(semester.years)}</td>
              <td>{getThaiMonthName(semester.month)}</td>
              <td>{getStatusLabel(semester.status)}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", semester)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", semester)}
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="0">ปิดเรียน</option>
                  <option value="1">เปิดเรียน</option>
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
                ? handleAddSemester
                : modalType === "edit"
                ? handleEditSemester
                : handleDeleteSemester
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

export default SemesterStatus;
