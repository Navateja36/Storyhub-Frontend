import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard ';
import { useNavigate } from 'react-router-dom';
// import Postdetailpage from './Postdetailpage';
const fetchURL = `${process.env.REACT_APP_API_BASE_URL}/api/posts/feed`;

export default function PostFeedPage () {
    const navigate=useNavigate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleNavigation = (postId) => {
        navigate(`/${postId}`);
        console.log(`Navigating to full post: ${postId}`); 
    };
    /*he user clicks the specific post. The code inside the PostCard knows exactly which post it is (because it was given the specific post object).  the id from there it comes here and lands on postId*/

    useEffect(() => {
        const fetchposts = async () => {
            // ... (your fetching logic here) ...
            // Simplified fetch logic for demonstration:
            try {
                const response = await fetch(fetchURL);
                const data = await response.json();
                setPosts(data.posts);
            } catch(error) {
                console.error("Error fetching feed:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchposts();
    }, []);
    

        
    /*The code works because you correctly initialized the state variable posts as an empty array (useState([])), which is a valid JavaScript object. This prevents the application from crashing instantly, as checking the length of an empty array ([].length > 0) is a safe operation. On the first millisecond (the initial render), the check evaluates to false, and the component safely renders the placeholder message "No posts found." Simultaneously, the network request is sent. Because your local Express server is extremely fast, the data is fetched almost instantly, and when setPosts(data.posts) runs, it forces the entire component to rerender. On this second, successful render, the posts array is populated, the condition becomes true, and the correct feed content is then displayed to the user.*/

    if (isLoading) return <div>Loading Feed...</div>;
    
    /*The isLoading state acts as a mandatory security gate for your user interface (UI) to prevent the application from crashing while waiting for slow internet data. Your component runs in a fast loop: it starts, tries to read data from the internet, and then re-renders. When the component first starts, the data variable (post or posts) is empty (null). Without the gate, the code immediately crashes because it tries to read the title of a post that doesn't exist yet, resulting in a runtime error. By setting isLoading to true at the start and placing an if (isLoading) return <div>Loading...</div> check at the top, you force the component to stop and show the spinner. The loading state is only switched to false after the network request has successfully delivered the data, guaranteeing the component only attempts to render content when the data is fully and safely available. This prevents crashes and provides essential feedback to the user on slow connections. */

    return (
        <div style={{ padding: '20px' }}>
            {/* <h1>Home Feed</h1> */}
            
            <div className="space-y-4">
                {posts.length > 0 ? (
                    // This is the single, correct use of the PostCard component:
                    posts.map(post => (
                        <PostCard
                            key={post._id} 
                            post={post}
                            onClick={handleNavigation}
                        />
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
}
