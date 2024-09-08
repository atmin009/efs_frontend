import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaSort, FaSortUp, FaSortDown, FaPlus,FaFileExcel } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx'; // เพิ่มการนำเข้าไลบรารี xlsx
import BASE_URL from "../../api";
const Building = () => {
  const [buildingData, setBuildingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groupData, setGroupData] = useState([]); // สำหรับเก็บข้อมูล groupbuilding
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [idGroup, setIdGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      buildingData.map((building) => ({
        รหัส: building.code,
        ชื่อ: building.name,
        พื้นที่: building.area,
        กลุ่ม: getGroupNameById(building.idGroup),
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buildings");
    
    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(workbook, "BuildingsData.xlsx");
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingResponse = await axios.get(`${BASE_URL}/buildings`);
        const groupResponse = await axios.get(`${BASE_URL}/groupbuildings`); // ดึงข้อมูลจาก groupbuilding
        
        // จัดเรียงข้อมูล building ตามชื่อ
        const sortedBuildingData = buildingResponse.data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        setBuildingData(sortedBuildingData);
        setFilteredData(sortedBuildingData);
        setGroupData(groupResponse.data); // เก็บข้อมูล groupbuilding
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(buildingData);
    setCurrentPage(1);
  }, [buildingData]);

  const getGroupNameById = (idGroup) => {
    const group = groupData.find((group) => group.id === idGroup);
    return group ? group.name : "ไม่พบข้อมูล";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleShowModal = (type, building = null) => {
    setModalType(type);
    setSelectedBuilding(building);

    if (type === "edit" && building) {
      setCode(building.code);
      setName(building.name);
      setArea(building.area || "");
      setIdGroup(building.idGroup || "");
    } else {
      setCode("");
      setName("");
      setArea("");
      setIdGroup("");
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBuilding(null);
    setCode("");
    setName("");
    setArea("");
    setIdGroup("");
  };

  const handleDeleteMultiple = async () => {
    try {
      for (const id of selectedRows) {
        await axios.delete(`${BASE_URL}/buildings/${id}`);
      }
      const fetchData = await axios.get(`${BASE_URL}/buildings`);
      setBuildingData(fetchData.data);
      setSelectedRows([]); // ล้างการเลือกหลังจากลบเสร็จ
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };
  
  const handleAddBuilding = async () => {
    try {
      const requestData = {
        code,
        name,
        area,
        idGroup: idGroup ? parseInt(idGroup) : null,
      };
      
      console.log("Request Data:", requestData);  // ตรวจสอบข้อมูลที่ถูกส่งไป
  
      const response = await axios.post(`${BASE_URL}/buildings/`, requestData);
  
      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/buildings`);
        setBuildingData(fetchData.data);
        handleCloseModal();
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const handleEditBuilding = async () => {
    try {
        const response = await axios.put(
            `${BASE_URL}/buildings/${selectedBuilding.id}`,
            {
                code,
                name,
                area,
                idGroup: idGroup ? parseInt(idGroup) : null,
            }
        );

        if (response.data) {
            const fetchData = await axios.get(`${BASE_URL}/buildings`);
            setBuildingData(fetchData.data);
            handleCloseModal();
            toast.success("บันทึกการแก้ไขสำเร็จ");
        }
    } catch (error) {
        console.error("Error updating data:", error);
        toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
};


  const handleDeleteBuilding = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/buildings/${selectedBuilding.id}`
      );

      if (response.data) {
        const fetchData = await axios.get(`${BASE_URL}/buildings`);
        setBuildingData(fetchData.data);
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
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <Pagination>
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end gap-2">
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
            <th onClick={() => handleSort("code")}>
              รหัส {getSortIcon("code")}
            </th>
            <th onClick={() => handleSort("name")}>
              ชื่อ {getSortIcon("name")}
            </th>
            <th onClick={() => handleSort("area")}>
              พื้นที่ {getSortIcon("area")}
            </th>
            <th onClick={() => handleSort("idGroup")}>
              รหัสกลุ่ม {getSortIcon("idGroup")}
            </th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((building) => (
            <tr key={building.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(building.id)}
                  onChange={() => handleSelectRow(building.id)}
                />
              </td>
              <td>{building.code}</td>
              <td>{building.name}</td>
              <td>{building.area}</td>
              <td>{getGroupNameById(building.idGroup)}</td> {/* แสดงชื่อแทน id */}
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("edit", building)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", building)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPaginationItems()}

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบทั้งหมด</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณแน่ใจว่าต้องการลบข้อมูลที่เลือกทั้งหมดหรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteMultiple();
              setShowDeleteAllModal(false); // ปิด Modal หลังจากลบข้อมูลแล้ว
            }}
          >
            ลบทั้งหมด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main Modal for Add/Edit/Delete */}
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
              <Form.Group controlId="formCode">
                <Form.Label>รหัส</Form.Label>
                <Form.Control
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="กรอกรหัส"
                />
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรอกชื่อ"
                />
              </Form.Group>
              <Form.Group controlId="formArea">
                <Form.Label>พื้นที่</Form.Label>
                <Form.Control
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="กรอกพื้นที่"
                />
              </Form.Group>
              <Form.Group controlId="formIdGroup">
              <Form.Label>กลุ่มอาคาร</Form.Label>
        <Form.Control
          as="select"
          value={idGroup}
          onChange={(e) => setIdGroup(e.target.value)}
        >
          <option value="">เลือกกลุ่มอาคาร</option>
          {groupData.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
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
                ? handleAddBuilding
                : modalType === "edit"
                ? handleEditBuilding
                : handleDeleteBuilding
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

export default Building;
