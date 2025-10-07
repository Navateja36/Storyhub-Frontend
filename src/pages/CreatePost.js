import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FETCH_URL = `${process.env.REACT_APP_API_BASE_URL}/api/posts/create`;

export default function CreatePost() {
    const navigate = useNavigate();
    
    // State for text inputs (title, content, tags)
    const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
    // NEW STATE: State for holding the selected image file object
    const [imageFile, setImageFile] = useState(null); 
    
    const [statusMessage, setStatusMessage] = useState('');

    const token = localStorage.getItem('token'); 

    // Handler for text inputs
    const handleChange = (e) => {
        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    };
    
    // Handler for the file input change
    const handleFileChange = (e) => {
        // Sets the state to the first file selected by the user
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Uploading and Submitting...');
        
        // 1. Check Token and Redirect if missing
        if (!token) {
            setStatusMessage("ERROR: Please log in to publish a story.");
            setTimeout(() => navigate('/login'), 1500); 
            return;
        }
        
        // 2. CRITICAL: Create FormData object for file/text transmission
        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('content', formData.content);
        // Process tags and append (Multer will read this as a text field)
        dataToSend.append('tags', formData.tags); 
        
        // Append the actual file only if one was selected
        if (imageFile) {
            // The key 'postImage' MUST match the name Multer is listening for in post.routes.js
            dataToSend.append('postImage', imageFile); 
        }

        try {
            const response = await fetch(FETCH_URL, {
                method: 'POST',
                headers: {
                    // CRITICAL: DO NOT set Content-Type. The browser handles it automatically for FormData.
                    'Authorization': `Bearer ${token}` 
                },
                body: dataToSend, // Send the FormData object
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setStatusMessage(`SUCCESS! Post published.`);
                // Clear form state and file input state
                setFormData({ title: '', content: '', tags: '' });
                setImageFile(null); 
                // Navigate to home feed after creation
                setTimeout(() => navigate('/'), 1000); 
            } else if (response.status === 401 || response.status === 403) {
                 localStorage.removeItem('token');
                 setStatusMessage(`ERROR: Session expired. Redirecting.`);
                 setTimeout(() => navigate('/login'), 1500);
            } else {
                setStatusMessage(`ERROR: ${data.message || 'Failed to publish post.'}`);
            }
        } catch (error) {
            setStatusMessage('FATAL NETWORK ERROR: Could not connect to server.');
            console.error('Network Error:', error);
        }
    }

    return (
        <div className="create-post-container">
          <h2 className="create-post-title">Write New Post (with Image Upload)</h2>
    
          <form onSubmit={handleSubmit} className="create-post-form">
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="create-post-input"
            />
    
            <textarea
              name="content"
              placeholder="Enter Content Here"
              value={formData.content}
              onChange={handleChange}
              required
              className="create-post-textarea"
            ></textarea>
    
            <label className="create-post-label">Upload Header Image (Max 5MB)</label>
            <input
              type="file"
              name="postImage"
              accept="image/*"
              onChange={handleFileChange}
              className="create-post-file"
            />
    
            <input
              type="text"
              name="tags"
              placeholder="Enter Tags Here (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="create-post-tags"
            />
    
            <button type="submit" className="create-post-button">
              Publish Post
            </button>
    
            {statusMessage && (
              <p
                className={`create-post-status ${
                  statusMessage.startsWith('ERROR') ? 'error' : 'success'
                }`}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      );
}