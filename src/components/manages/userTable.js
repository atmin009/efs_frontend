import React, { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  Button,
  Modal,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus 
} from "react-icons/fa";
import RegisByAdm from "../modals/RegisByAdm";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "fname",
    direction: "asc",
  });
  const [statusFilter, setStatusFilter] = useState("");

  // สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/members");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (statusFilter !== "") {
      filtered = filtered.filter(
        (user) => user.status.toString() === statusFilter
      );
    }

    if (searchTerm !== "") {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // สำหรับ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedUsers.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const saveChanges = async () => {
    if (!selectedUser) return;

    try {
      const updatedUser = {
        id: selectedUser.id,
        username: selectedUser.username,
        fname: selectedUser.fname,
        lname: selectedUser.lname,
        email: selectedUser.email,
        phone: selectedUser.phone,
        status: parseInt(selectedUser.status),
        password: selectedUser.password || null,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/members/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...data } : user
          )
        );
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        alert("ไม่สามารถอัปเดตข้อมูลได้: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/members/${selectedUser.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteModal(false);
      } else {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
<Row className="mb-3 d-flex justify-content-end">
  <Col xs={12} md={6} className="d-flex justify-content-end">
    <Form.Control
      type="text"
      placeholder="ค้นหา..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="me-2 w-50"
    />
    <Form.Control
      as="select"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="me-2 w-25"
    >
      <option value="">สถานะทั้งหมด</option>
      <option value="0">ผู้ดูแลระบบ</option>
      <option value="1">เจ้าหน้าที่</option>
      <option value="2">ผู้บริหาร</option>
      <option value="3">ผู้ใช้ทั่วไป</option>
    </Form.Control>
    <Button onClick={handleShowModal}>
      <FaPlus className="me-1" /> เพิ่มผู้ใช้
    </Button>
  </Col>
</Row>


      <RegisByAdm show={showModal} handleClose={handleCloseModal} />

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              #{" "}
              {sortConfig.key === "id" &&
                (sortConfig.direction === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                ))}
            </th>
            <th onClick={() => handleSort("fname")}>
              ชื่อจริง{" "}
              {sortConfig.key === "fname" &&
                (sortConfig.direction === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                ))}
            </th>
            <th onClick={() => handleSort("lname")}>
              นามสกุล{" "}
              {sortConfig.key === "lname" &&
                (sortConfig.direction === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                ))}
            </th>
            <th>สถานะ</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>
                {user.status === 0
                  ? "ผู้ดูแลระบบ"
                  : user.status === 1
                  ? "เจ้าหน้าที่"
                  : user.status === 2
                  ? "ผู้บริหาร"
                  : "ผู้ใช้ทั่วไป"}
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleView(user)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="mt-3">
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {[...Array(Math.ceil(filteredUsers.length / rowsPerPage))].map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredUsers.length / rowsPerPage)
          }
        />
      </Pagination>

      {/* Modal สำหรับดูรายละเอียด */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Anuphan' }}>รายละเอียดผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Anuphan' }}>
          {selectedUser && (
            <>
              <p>ชื่อผู้ใช้งาน: {selectedUser.username}</p>
              <p>ชื่อจริง: {selectedUser.fname}</p>
              <p>นามสกุล: {selectedUser.lname}</p>
              <p>
                สถานะ:{" "}
                {selectedUser.status === 0
                  ? "ผู้ดูแลระบบ"
                  : selectedUser.status === 1
                  ? "เจ้าหน้าที่"
                  : selectedUser.status === 2
                  ? "ผู้บริหาร"
                  : "ผู้ใช้ทั่วไป"}
              </p>
              <p>อีเมล: {selectedUser.email}</p>
              <p>เบอร์โทร: {selectedUser.phone}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal สำหรับแก้ไขข้อมูล */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Anuphan' }}>แก้ไขข้อมูลผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Anuphan' }}>
          {selectedUser && (
            <Form>
              <Form.Group>
                <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>ชื่อจริง</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.fname}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, fname: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>นามสกุล</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.lname}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, lname: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>สถานะ</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={0}>ผู้ดูแลระบบ</option>
                  <option value={1}>เจ้าหน้าที่</option>
                  <option value={2}>ผู้บริหาร</option>
                  <option value={3}>ผู้ใช้ทั่วไป</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>รหัสผ่าน (หากต้องการเปลี่ยน)</Form.Label>
                <Form.Control
                  type="password"
                  value={selectedUser.password || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      password: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer style={{ fontFamily: 'Anuphan' }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal สำหรับยืนยันการลบ */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Anuphan' }}>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Anuphan' }}>
          คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้:{" "}
          {selectedUser && selectedUser.username}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
