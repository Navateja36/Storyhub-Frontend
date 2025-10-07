import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/posts/feed`;

export default function PostCard({ post, onClick }) {
    const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);
    const imageUrl = post.imageUrl ? `${API_BASE_URL}${post.imageUrl}` : null;
    const clapCount = Array.isArray(post.claps) ? post.claps.length : 0;

    // Note: The parent component must include the necessary CSS classes defined in the <style> block.
    return (
        <div 
            className="post-card" 
            onClick={() => onClick(post._id)} // Navigates to the detail page
        >
            {/* 1. Content Area (Left Side) */}
            <div className="post-card-content">
                <div>
                    {/* Title: Merriweather/Serif Font */}
                    <h3 className="post-title">{post.title}</h3>
                    
                    {/* Excerpt: Clean Inter/Sans-serif Font */}
                    <p className="post-excerpt">{post.excerpt}</p>
                </div>

                {/* Footer Meta Data */}
                <div className="post-meta">
                    <div className="meta-left">
                        {/* Author Name */}
                        <span className="author-name">{post.author?.name || 'Unknown Author'}</span>
                        <span>•</span>
                        {/* Creation Date */}
                        <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="meta-right">
                         <span>{readingTime} min read</span>
                         <span>•</span>
                         <span>{clapCount} Claps</span>
                         {/* here is the reason why we used clapcount variable here ---->>>   c:\Users\M Navateja\AppData\Local\Packages\MicrosoftWindows.Client.Core_cw5n1h2txyewy\TempState\ScreenClip\{CB66DBB4-F660-40F9-8491-7EDD4C374A12}.png */}
                    </div>
                </div>
            </div>

            {/* 2. Image Area (Right Side) */}
            {imageUrl && (
                <div className="post-image">
                    <img 
                        src={imageUrl} 
                        alt={post.title} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/180x180/e5e7eb/4b5563?text=Image'; 
                        }}
                    />
                </div>
            )}
        </div>
    );
}
