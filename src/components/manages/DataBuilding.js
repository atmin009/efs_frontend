import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

function DataBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/buildings/');
        if (response.ok) {
          const data = await response.json();
          setBuildings(data);
          setFilteredBuildings(data);
        } else {
          setError('Failed to fetch buildings');
        }
      } catch (error) {
        setError('Failed to fetch buildings');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  useEffect(() => {
    const filtered = buildings.filter(
      (building) =>
        building.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  const handleShowModal = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBuilding(null);
    setShowModal(false);
  };

  const handleDelete = async (buildingId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/buildings/${buildingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBuildings(buildings.filter((building) => building.id !== buildingId));
      } else {
        alert('Failed to delete building');
      }
    } catch (error) {
      console.error('Error deleting building:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await handleDelete(id);
      }
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk deleting buildings:', error);
    }
  };

  const handleSelect = (id) => {
    const updatedSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(updatedSelectedIds);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredBuildings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBuildings.map((building) => building.id));
    }
  };

  const currentItems = filteredBuildings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage);

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        <Button onClick={() => handleShowModal(null)}>เพิ่มข้อมูลอาคาร</Button>
      </div>

      {selectedIds.length > 0 && (
        <Button variant="danger" className="mb-3" onClick={handleBulkDelete}>
          ลบข้อมูลที่เลือก
        </Button>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length > 0 && selectedIds.length === filteredBuildings.length}
              />
            </th>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>พื้นที่</th>
            <th>idbuilding</th> {/* New Column for idGroup */}
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((building) => (
            <tr key={building.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(building.id)}
                  onChange={() => handleSelect(building.id)}
                />
              </td>
              <td>{building.code}</td>
              <td>{building.name}</td>
              <td>{building.area}</td>
              <td>{building.idGroup}</td> {/* Display idGroup */}
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(building)}>
                  <FaEdit /> แก้ไข
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(building.id)}>
                  <FaTrash /> ลบ
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <div>Page {currentPage} of {totalPages}</div>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
              onClick={() => setCurrentPage(index + 1)}
              className="me-1"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBuilding ? 'แก้ไขข้อมูลอาคาร' : 'เพิ่มข้อมูลอาคาร'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for adding/editing building goes here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
          <Button variant="primary">
            {selectedBuilding ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มข้อมูล'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DataBuilding;
