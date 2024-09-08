import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
const AnnouncementForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (attachment) formData.append('attachment', attachment);
        if (coverImage) formData.append('cover_image', coverImage);

        try {
            await axios.post(`${BASE_URL}/announcements/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Announcement created successfully');
        } catch (error) {
            console.error('There was an error creating the announcement!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Attachment:</label>
                <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files[0])}
                />
            </div>
            <div>
                <label>Cover Image:</label>
                <input
                    type="file"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default AnnouncementForm;
