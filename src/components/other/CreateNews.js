import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import BASE_URL from '../../api';
const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');  // เนื้อหาจะถูกจัดการด้วย CKEditor
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null); // สำหรับแสดงภาพตัวอย่าง
  const [attachment, setAttachment] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);  // เนื้อหาถูกเก็บจาก CKEditor
    formData.append('cover_image', coverImage);
    formData.append('attachment', attachment);

    try {
      const response = await axios.post(`${BASE_URL}/news/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setToastMessage('News created successfully!');
      setToastVariant('success');
      setShowToast(true);
      setTitle('');  // ล้างฟอร์ม
      setContent('');
      setCoverImage(null);
      setCoverImagePreview(null);
      setAttachment(null);
    } catch (error) {
      setToastMessage('Error creating news.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file)); // แสดงภาพตัวอย่าง
    }
  };

  return (
    <Container style={{ marginTop: '20px', fontFamily: 'Anuphan, sans-serif' }}>
      <h3 className="text-center mb-4">ข่าวประชาสัมพันธ์/ประกาศ</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="newsTitle" className="mb-3">
          <Form.Label>เรื่อง</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="กรุณาระบุหัวข้อ"
          />
        </Form.Group>

        <Form.Group controlId="newsContent" className="mb-3">
          <Form.Label>รายละเอียด</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={content} 
            config={{
                height: 600,
              }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data); 
            }}
          />
        </Form.Group>

        <Form.Group controlId="coverImage" className="mb-3">
          <Form.Label>ภาพปกข่าว</Form.Label>
          <Form.Control
            type="file"
            onChange={handleCoverImageChange}
            required
          />
          {coverImagePreview && (
            <div className="mt-3">
              <img
                src={coverImagePreview}
                alt="Cover Preview"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="attachment" className="mb-3">
          <Form.Label>ไฟล์แนบอื่นๆ</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          สร้างการประชาสัมพันธ์
        </Button>
      </Form>

      {/* Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg={toastVariant}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: '200px',
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default CreateNews;
