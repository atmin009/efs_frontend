import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Table,
  Dropdown,
  DropdownButton,
  Form,
  Pagination,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  FaEdit,
  FaTrashAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaCalendarAlt,
  FaRegCalendar,
  FaFileExcel 
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./NumberOfUsers.css";
import * as XLSX from 'xlsx'; // นำเข้าไลบรารี xlsx
import BASE_URL from "../../api";
const NumberOfUsers = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "years",
    direction: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // State for delete confirmation modal
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map((user) => ({
      ปี: convertToBE(user.years),
      เดือน: getThaiMonthName(user.month),
      จำนวน: user.amount
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");
    XLSX.writeFile(workbook, "UsersData.xlsx");
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/numberofusers`);
        const sortedData = response.data.sort((a, b) => {
          if (a.years === b.years) {
            return a.month - b.month;
          }
          return a.years - b.years;
        });

        const uniqueYears = [...new Set(sortedData.map((item) => item.years))]
          .sort((a, b) => b - a); // Sort years in descending order
        const uniqueMonths = [...new Set(sortedData.map((item) => item.month))];

        setYears(uniqueYears);
        setMonths(uniqueMonths);
        setUsersData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = usersData;

    if (yearFilter) {
      filtered = filtered.filter((item) => item.years === parseInt(yearFilter));
    }

    if (monthFilter) {
      filtered = filtered.filter(
        (item) => item.month === parseInt(monthFilter)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [yearFilter, monthFilter, usersData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleShowModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);

    if (type === "edit" && user) {
      setNewYear(user.years + 543);
      setNewAmount(user.amount);
    } else {
      setNewYear("");
      setNewAmount("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewYear("");
    setNewAmount("");
  };

  const handleAddUser = async () => {
    try {
      const yearCE = parseInt(newYear) - 543;
      const currentYearCE = new Date().getFullYear(); // ดึงปีปัจจุบันแบบ ค.ศ.
  
      if (yearCE > currentYearCE) {
        toast.warning("ไม่สามารถเพิ่มข้อมูลในปีที่มากกว่าปีปัจจุบันได้");
        return;
      }
  
      const existingData = usersData.find((user) => user.years === yearCE);
  
      if (existingData) {
        toast.warning("มีข้อมูลในปีดังกล่าวแล้ว");
        return;
      }
  
      const response = await axios.post(
        `${BASE_URL}/add-numberofusers/`,
        {
          years: yearCE,
          amount: parseInt(newAmount),
        }
      );
  
      if (response.data.message === "Data added successfully") {
        const fetchData = await axios.get(`${BASE_URL}/numberofusers`);
        setUsersData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  

  const handleEditUser = async () => {
    try {
      const yearCE = parseInt(newYear) - 543;
      const response = await axios.put(
        `${BASE_URL}/update-numberofusers/${selectedUser.id}`,
        {
          years: yearCE,
          amount: parseInt(newAmount),
        }
      );

      if (response.data.message === "Data updated successfully") {
        const fetchData = await axios.get(
          `${BASE_URL}/numberofusers`
        );
        setUsersData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-numberofusers/${selectedUser.id}`
      );

      if (response.data.message === "Data deleted successfully") {
        const fetchData = await axios.get(
          `${BASE_URL}/numberofusers`
        );
        setUsersData(fetchData.data);
        handleCloseModal();
        toast.success("ลบข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleDeleteSelectedUsers = async () => {
    try {
      for (let id of selectedRows) {
        await axios.delete(`${BASE_URL}/delete-numberofusers/${id}`);
      }
      const fetchData = await axios.get(`${BASE_URL}/numberofusers`);
      setUsersData(fetchData.data);
      setSelectedRows([]);
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (direction === "ascending") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setFilteredData(sortedData);
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

  const convertToBE = (yearCE) => yearCE + 543;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
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
    } else {
      let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
      let endPage = currentPage + 2 < totalPages ? currentPage + 2 : totalPages;

      if (startPage > 1) {
        pageNumbers.push(
          <Pagination.Item key={1} onClick={() => paginate(1)}>
            1
          </Pagination.Item>
        );
        pageNumbers.push(<Pagination.Ellipsis key="start-ellipsis" />);
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
        pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
        pageNumbers.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }

    return pageNumbers;
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
  };

  const confirmDeleteSelectedUsers = () => {
    handleDeleteSelectedUsers();
    setShowConfirmDeleteModal(false);
  };

  return (
    <div>
      <div className="filter-container">
        <div className="filter-dropdowns">
          <DropdownButton
            id="dropdown-year"
            title={
              <>
                <FaCalendarAlt style={{ marginRight: "8px" }} />
                {`ปี (พ.ศ.): ${
                  yearFilter ? convertToBE(parseInt(yearFilter)) : "ทั้งหมด"
                }`}
              </>
            }
            onSelect={setYearFilter}
            variant="secondary" // Change dropdown color
          >
            <Dropdown.Item eventKey="">ทั้งหมด</Dropdown.Item>
            {years.map((year) => (
              <Dropdown.Item key={year} eventKey={year}>
                {convertToBE(year)}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton
            id="dropdown-month"
            title={
              <>
                <FaRegCalendar style={{ marginRight: "8px" }} />
                {`เดือน: ${
                  monthFilter ? getThaiMonthName(monthFilter) : "ทั้งหมด"
                }`}
              </>
            }
            onSelect={setMonthFilter}
            variant="secondary" // Change dropdown color
          >
            <Dropdown.Item eventKey="">ทั้งหมด</Dropdown.Item>
            {months.map((month) => (
              <Dropdown.Item key={month} eventKey={month}>
                {getThaiMonthName(month)}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div className="button-group">
        {selectedRows.length > 0 && ( // Show delete button only if rows are selected
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              className="ms-2"
            >
              <FaTrashAlt className="me-1" />
              ลบที่เลือก
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
            <th>จำนวน</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user, index) => (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                />
              </td>
              <td>{convertToBE(user.years)}</td>
              <td>{getThaiMonthName(user.month)}</td>
              <td>{user.amount.toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", user)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", user)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {renderPaginationItems()}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
        />
      </Pagination>
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
              <Form.Group controlId="formYear">
                <Form.Label>ปี (พ.ศ.)</Form.Label>
                <Form.Control
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="กรอกปี (พ.ศ.)"
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>จำนวน</Form.Label>
                <Form.Control
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="กรอกจำนวน"
                />
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
      ? handleAddUser
      : modalType === "edit"
      ? handleEditUser
      : handleDeleteUser
  }
>
  {modalType === "delete" ? "ลบ" : "บันทึก"}
</Button>

        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmDeleteModal}
        onHide={handleCancelDelete}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณแน่ใจว่าต้องการลบข้อมูลที่เลือกหรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={confirmDeleteSelectedUsers}>
            ลบข้อมูล
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer /> {/* Container สำหรับการแสดงการแจ้งเตือน */}
    </div>
  );
};

const getThaiMonthName = (monthNumber) => {
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return months[monthNumber - 1];
};

export default NumberOfUsers;
