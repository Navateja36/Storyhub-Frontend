import React from 'react';

const API_BASE_URL = 'http://localhost:5000'; 

export default function PostCard({ post, onClick }) {
    // Determine the reading time (simple estimate based on word count)
    
    // Construct the full path to the image
    const imageUrl = post.imageUrl ? `${API_BASE_URL}${post.imageUrl}` : null;
    
    // Check if the image should be rendered.
    const hasImage = !!imageUrl;
    const clapCount = Array.isArray(post.claps) ? post.claps.length : 0; 

    return (
        <div 
            className="post-card" 
            onClick={() => onClick(post._id)}
            style={{ 
                // Main container styling (ensures image is always on the right when present)
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'stretch',
                margin: '10px auto 24px auto',
            }}
        >
            {/* 1. Content Area (Fluid Width) */}
            <div 
                className="post-card-content"
                style={{ 
                    flexGrow: 1, 
                    // CRITICAL FIX 1: Content takes up 100% of the card when there is no image
                    width: hasImage ? 'calc(100% - 180px)' : '100%' 
                }}
            >
                <div>
                    {/* Title */}
                    <h3 className="post-title">{post.title}</h3>
                    
                    {/* Excerpt */}
                    <p className="post-excerpt">{post.excerpt}</p>
                </div>

                {/* Footer Meta Data */}
                <div className="post-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                    
                    {/* CRITICAL FIX 2: Author and Date Row (Primary Info) */}
                    <div className="meta-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="author-name">{post.author?.name || 'Unknown Author'}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* CRITICAL FIX 3: Time and Claps Row (Secondary Info, directly below author) */}
                    <div className="meta-right" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#777' }}>
                        <span>•</span>
                        <span>{clapCount} Claps</span>
                    </div>
                </div>
            </div>

            {/* 2. Image Area (Right Side - Renders ONLY if hasImage is true) */}
            {hasImage && (
                <div className="post-image" style={{ width: '180px', flexShrink: 0, borderLeft: '1px solid #eee' }}>
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="post-image-img"
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
