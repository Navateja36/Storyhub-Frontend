import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/posts`;

export default function Postdetailpage() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const loggedInUserId = loggedInUser?._id;

    const fetchPost = async () => {
        if (!postId) {
            setError('Post ID missing');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${postId}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Server communication failed." }));
                throw new Error(errorData.message || `Failed with status ${response.status}`);
            }

            const data = await response.json();
            setPost(data.posts); // ✅ your backend returns { posts: post }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching post:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClap = async () => {
        if (!loggedInUserId) {
            alert("Please log in to clap for this post.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clap/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Clap failed." }));
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setPost(data.posts); // ✅ backend returns { posts: updatedPost }
        } catch (err) {
            console.error("Clap error:", err);
            alert(`Clap failed: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    if (loading) return <div>Loading Article Details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Article Not Found.</div>;

    const clapsArray = Array.isArray(post.claps) ? post.claps : [];
    const isClapped = clapsArray.map(id => id.toString()).includes(loggedInUserId);
    const clapCount = clapsArray.length;

    const finalUrl = post.imageUrl ? post.imageUrl : null;

    return (
        <div className="post-container">
            <div className="max-w-3xl mx-auto p-6 mt-8">
                <h1 className="text-4xl mb-3 font-bold">{post.title}</h1>

                {finalUrl && (
                    <img
                        src={finalUrl}
                        alt={post.title}
                        style={{
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}
                        onError={(e) => (e.target.style.display = 'none')}
                    />
                )}

                <p className="text-gray-600 mb-6">
                    By <strong>{post.author.name+"  "}</strong>
                    {new Date(post.createdAt).toLocaleDateString()}
                </p>

                <div className="text-lg leading-relaxed whitespace-pre-line">
                    {post.content}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-center">
                    <button
                        onClick={handleClap}
                        className={`px-4 py-2 rounded-full font-medium transition ${
                            isClapped
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                        style={{ border: '1px solid #ccc' }}
                    >
                        {isClapped ? '👏 Clapped' : 'Clap'}
                    </button>

                    <span className="text-lg font-semibold text-gray-800">
                        {clapCount} {clapCount === 1 ? "Clap" : "Claps"}
                    </span>
                </div>
            </div>
        </div>
    );
}
