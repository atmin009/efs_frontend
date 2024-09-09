import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Spinner, Modal, Form } from 'react-bootstrap'; // เพิ่มการ import 'Form'
import { FaTrash, FaEye,FaPlus  } from 'react-icons/fa';  // ใช้ไอคอน View และ Delete
import axios from 'axios';
import { Link } from 'react-router-dom';  // ใช้สำหรับลิงก์
import BASE_URL from '../../../api';

const NewsTable = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // Modal ยืนยันการลบ
  const [selectedNews, setSelectedNews] = useState(null);  // ข่าวที่เลือก
  const [newsIdToDelete, setNewsIdToDelete] = useState(null);  // ID ข่าวที่ต้องการลบ

  // ดึงข้อมูลข่าวจาก API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/news`);
        setNewsList(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ฟังก์ชันลบข่าว (เปิด modal ยืนยัน)
  const handleDelete = (id) => {
    setNewsIdToDelete(id);
    setShowDeleteModal(true);
  };

  // ฟังก์ชันยืนยันการลบ
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/news/${newsIdToDelete}`);
      setNewsList(newsList.filter((news) => news.id !== newsIdToDelete));  // ลบข่าวออกจากรายการ
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  // ฟังก์ชันเปิด Modal เพื่อดูรายละเอียดข่าว
  const handleView = (news) => {
    setSelectedNews(news);
    setShowModal(true);
  };

  // ฟังก์ชันปิด Modal
  const handleCloseModal = () => {
    setSelectedNews(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <div className="d-flex justify-content-between align-items-center">
        <h3>ข่าวประชาสัมพันธ์/ประกาศ</h3>
        {/* ปุ่มสำหรับสร้างข่าวใหม่ */}
        <Link to="/admin/createnews">
          <Button variant="success">
            <FaPlus className="me-2" />
            สร้างข่าวใหม่
          </Button>
        </Link>
      </div>
      {/* ตารางแสดงข่าว */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ลำดับที่</th>
            <th>เรื่อง</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news, index) => (
            <tr key={news.id}>
              <td>{index + 1}</td>
              <td>{news.title}</td>
              <td>
                <Button variant="info" onClick={() => handleView(news)} className="me-2">
                  <FaEye />  {/* ไอคอนสำหรับ View */}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(news.id)}>
                  <FaTrash />  {/* ไอคอนสำหรับ Delete */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal สำหรับดูข่าว */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียด</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Anuphan, sans-serif' }}>
          <h3>{selectedNews?.title}</h3>
          <div
            dangerouslySetInnerHTML={{ __html: selectedNews?.content }}  // ใช้แสดง HTML จาก CKEditor
          />
          {selectedNews?.cover_image && (
            <div className="mt-3">
              <Form.Label>ภาพปกข่าว</Form.Label>
              <img
                src={`${BASE_URL}/images/${selectedNews.cover_image}`}
                alt="Cover"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal ยืนยันการลบ */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณแน่ใจว่าต้องการลบข้อมูลที่เลือกหรือไม่</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsTable;
