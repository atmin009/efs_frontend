import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaSort, FaSortUp, FaSortDown, FaPlus,FaFileExcel } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx'; // เพิ่มการนำเข้าไลบรารี xlsx
import BASE_URL from "../../api";
const GroupBuilding = () => {
  const [groupData, setGroupData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      groupData.map((group) => ({
        ชื่อ: group.name,
        รายละเอียด: group.about,
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GroupBuildings");
    
    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(workbook, "GroupBuildings.xlsx");
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/groupbuildings`);
        setGroupData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (type, group = null) => {
    setModalType(type);
    setSelectedGroup(group);

    if (type === "edit" && group) {
      setName(group.name);
      setAbout(group.about);
    } else {
      setName("");
      setAbout("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
    setName("");
    setAbout("");
  };

  const handleAddGroup = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/groupbuildings`, {
        name,
        about,
      });

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/groupbuildings`);
        setGroupData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEditGroup = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/groupbuildings/${selectedGroup.id}`,
        {
          name,
          about,
        }
      );

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/groupbuildings`);
        setGroupData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกการแก้ไขสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/groupbuildings/${selectedGroup.id}`
      );

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/groupbuildings`);
        setGroupData(fetchData.data);
        handleCloseModal();
        toast.success("ลบข้อมูลสำเร็จ");
      }
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

    const sortedData = [...groupData].sort((a, b) => {
      if (direction === "ascending") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setGroupData(sortedData);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const renderPaginationItems = () => {
    const totalPages = Math.ceil(groupData.length / itemsPerPage);
    const pageNumbers = [];
  
    // Previous button
    pageNumbers.push(
      <Pagination.Prev
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1} // ปิดการใช้งานปุ่มหากเป็นหน้าแรก
      />
    );
  
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
  
    // Next button
    pageNumbers.push(
      <Pagination.Next
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages} // ปิดการใช้งานปุ่มหากเป็นหน้าสุดท้าย
      />
    );
  
    return pageNumbers;
  };
  
  

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => handleShowModal("add")}>
          <FaPlus className="me-1" />
          เพิ่มข้อมูล
        </Button>
        <Button variant="success" className="ms-2" onClick={exportToExcel}>
  <FaFileExcel className="me-1" /> ดาวน์โหลด Excel
</Button>

      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort("name")}>
              ชื่อกลุ่มอาคาร {getSortIcon("name")}
            </th>
            <th onClick={() => handleSort("about")}>
              รายละเอียด {getSortIcon("about")}
            </th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((group, index) => (
            <tr key={group.id}>
              <td>{indexOfFirstItem + index + 1}</td> {/* ลำดับเลขคอลัมน์ */}
              <td>{group.name}</td>
              <td>{group.about}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", group)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", group)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {groupData.length > itemsPerPage && (
        <Pagination>
          {renderPaginationItems()}
        </Pagination>
      )}

      {/* Modal */}
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
              <Form.Group controlId="formName">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรอกชื่อ"
                />
              </Form.Group>
              <Form.Group controlId="formAbout">
                <Form.Label>รายละเอียด</Form.Label>
                <Form.Control
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="กรอกรายละเอียด"
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
                ? handleAddGroup
                : modalType === "edit"
                ? handleEditGroup
                : handleDeleteGroup
            }
          >
            {modalType === "delete" ? "ลบ" : "บันทึก"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer /> {/* Container สำหรับการแสดงการแจ้งเตือน */}
    </div>
  );
};

export default GroupBuilding;
