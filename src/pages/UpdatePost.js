import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/posts`;

export default function UpdatePost() {
    const { postId } = useParams(); 
    const navigate = useNavigate();
    const [post, setPost] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' }); 
    const [statusMessage, setStatusMessage] = useState('');

    const token = localStorage.getItem('token'); 
    
    useEffect(() => {
        if (!postId || !token) {
            setLoading(false);
            if (!token) navigate('/login');
            return; 
        }
        
        const fetchPostForEdit = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${postId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch post.');
                }
                
                const data = await response.json();
                const fetchedPost = data.posts;
                
                setPost(fetchedPost);

                setFormData({
                    title: fetchedPost.title,
                    content: fetchedPost.content,
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPostForEdit();
    }, [postId, navigate, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async(e) => {
        e.preventDefault();
        setLoading(true); 
        setStatusMessage('Saving changes...');

        try {
            const response = await fetch(`${API_BASE_URL}/${postId}`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData), 
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setStatusMessage(`SUCCESS! ${data.message}`);
                setTimeout(() => navigate(`/profile`), 1000); 
            } else if (response.status === 403) {
                 setStatusMessage("ERROR: You are not authorized to edit this post.");
            } else {
                setStatusMessage(`ERROR: ${data.message || 'Update failed.'}`);
            }

        } catch (error) {
            setStatusMessage('FATAL Network Error.');
            console.error('Update Submission Error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // --- 3. Conditional Rendering ---
    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!post) return <p>Post not found.</p>;


    return (
        <div className="update-post-container">
            <h1>Edit Post: {post.title}</h1>

            <form onSubmit={handleUpdateSubmit}>
                <p className="author-id">Author ID: {post.author._id}</p>

                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                />
                <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Content"
                required
                />

                <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes (PUT)'}
                </button>

                {statusMessage && <p className="status-message">{statusMessage}</p>}
            </form>
        </div>

    );
}