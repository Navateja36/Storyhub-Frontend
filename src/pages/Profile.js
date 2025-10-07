import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/posts/userPosts`;
const deletePostUrl = `${process.env.REACT_APP_API_BASE_URL}/api/posts`;

export default function Profile() {
    const rawUserData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    let user = null;
    if (rawUserData) {
        try {
            user = JSON.parse(rawUserData);
        } catch (e) {
            console.error("Failed to parse user data from Local Storage:", e);
        }
    }
    
    // Function to fetch posts (defined so it can be called again after deletion)
    const fetchposts = async () => {
        if (!user || !token) { // Ensure token check is here too
            setIsLoading(false);
            return;
        }

        try {
            const fetchUrl = `${API_BASE_URL}/${user._id}`;
            const response = await fetch(fetchUrl, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            // Handle 401/403 errors separately to trigger redirect
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login'), 1500);
                return;
            }

            const data = await response.json(); 
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user posts.');
            }
            setPosts(data.posts);
            setError(null); // Clear any previous errors

        } catch(error) {
            setError(error.message);
            console.error('Error fetching profile posts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Function to handle the DELETE request
    const deletePost = async (postIdToDelete) => { // FIX 1: Accepts postId as argument
        if (!window.confirm("Are you sure you want to delete this post?")) return; // Simple confirmation

        try {
            // FIX 2: Correctly constructs the URL with the Post ID
            const fetchUrl = `${deletePostUrl}/${postIdToDelete}`; 
            
            const response = await fetch(fetchUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` 
                },
            });
            
            // Handle 401/403 redirection here as well
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login'), 1500);
                return;
            }
            
            const data = await response.json(); 
            if (!response.ok) {
                throw new Error(data.message || 'Deletion failed.');
            }
            
            alert("Post deleted successfully!");
            fetchposts(); // FIX 3: Re-fetch the list to update the screen

        } catch(error) {
            setError(error.message);
            console.error('Error deleting post:', error);
        }
    };
    const editpost=(postId)=>{
        navigate(`/editpost/${postId}`)
    }
    
    // Initial fetch on component mount
    useEffect(() => {
        fetchposts();
    }, [user?._id, token]); // Re-fetch only when user ID or token changes

    if (!user) {
        return <div className="text-center p-8 text-red-600">Please sign in to view your profile.</div>;
    }
    
    if (isLoading) {
        return <div>Loading your profile and posts...</div>
    }
    
    return (
        <div className="profile-container">
            <h1 className="profile-title">Your Profile</h1>

            <div className="profile-info">
                <p>Name: <span>{user.name}</span></p>
                <p>Email: <span>{user.email}</span></p>
                <p>Total Posts: <span>{posts.length}</span></p>
            </div>

            <div className="posts-section">
                <h2>Your Published Stories</h2>
                {error && <div className="profile-error">{error}</div>}

                {posts.length === 0 ? (
                <p className="text-gray-500">You haven't published any posts yet.</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="post-card">
                          <h3>{post.title}</h3>
                          
                          <div className="post-meta">
                            <span>Claps: {post.claps.length}</span>
                            <span>Author: {user.name}</span>
                          </div>
                            <div>
                                <img style={{'width': '80px','margin-top': '13px','margin-right': '10px'}} src={`https://storyhub-fn70.onrender.com${post.imageUrl}`} alt="" />
                            
                            </div>
            
                          <div className="post-excerpt">{post.excerpt}</div>
                      
                          <div className="post-actions">
                            <button className="delete-button" onClick={() => deletePost(post._id)}>Delete</button>
                            <button className="edit-button" onClick={() => editpost(post._id)}>Edit</button>
                          </div>
                        </div>
                      ))
                )}
            </div>
        </div>

    );
}