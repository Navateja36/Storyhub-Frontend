import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_LOGOUT_URL = `${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`;
const MEDIUM_GREEN = '#1A8917'; 

// Function to safely get the user's initial (name) for the avatar circle
const getInitials = () => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
        try {
            const user = JSON.parse(rawUser);
            // Use the first letter of the name or email
            return user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
        } catch (e) {
            return '?';
        }
    }
    return 'L'; // Default for logged out (Login)
};

export default function Navbar() {
    const navigate = useNavigate();
    // NEW STATE: Controls whether the dropdown menu is visible
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Check if the user is authenticated (simplistic check)
    const isAuthenticated = localStorage.getItem('token') !== null;

    const handleLogout = async () => {
        setIsMenuOpen(false); // Close menu on action
        try {
            await fetch(API_LOGOUT_URL, { method: 'POST' });
        } catch (error) {
            console.error('Network failure during logout attempt. Proceeding with client cleanup.');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };
    
    // Combined action handler for dropdown links
    const handleMenuNavigation = (path) => {
        setIsMenuOpen(false); // Close the menu
        navigate(path);
    };

    return (
        <header style={{ 
            position: 'sticky', 
            top: 0,
            width: '100%',
            zIndex: 1000, 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '10px 0', 
            borderBottom: '1px solid #f2f2f2',
            backgroundColor: 'white', 
            fontFamily: 'Georgia, serif' 
        }}>
            <div style={{ maxWidth: '1600px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                
                {/* Logo/Home Link */}
                <div 
                    onClick={() => navigate('/')} 
                    style={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', color: '#333' }}
                >
                    Story Hub
                </div>

                {/* Navigation and Actions */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
                    
                    {/* Standard Action Links */}
                    <button 
                        onClick={() => navigate('/')} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#333', fontSize: '15px' }}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => navigate('/create')} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#333', fontSize: '15px' }}
                    >
                        Write
                    </button>

                    {/* --- Profile Avatar and Dropdown --- */}
                    {isAuthenticated ? (
                        <>
                            {/* Avatar Button */}
                            <div 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
                                style={{ 
                                    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#6200EE', // Purple background
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
                                    flexShrink: 0 
                                }}
                            >
                                {getInitials()}
                            </div>

                            {/* Dropdown Menu (Conditional Rendering) */}
                            {isMenuOpen && (
                                <div style={{ 
                                    position: 'absolute', top: '45px', right: 0, width: '160px', 
                                    backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
                                }}>
                                    {/* Profile Link */}
                                    <button 
                                        onClick={() => handleMenuNavigation('/profile')}
                                        style={{ width: '100%', padding: '10px 15px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '15px' }}
                                    >
                                        Your Profile
                                    </button>
                                    
                                    {/* Logout Button */}
                                    <button 
                                        onClick={handleLogout}
                                        style={{ width: '100%', padding: '10px 15px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '15px' }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        // If NOT Authenticated, show Register button (Medium Green)
                        <button 
                            onClick={() => navigate('/register')}
                            style={{ 
                                padding: '8px 16px', 
                                borderRadius: '999px', 
                                backgroundColor: MEDIUM_GREEN, 
                                color: 'white', 
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#157512'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = MEDIUM_GREEN}
                        >
                            Get Started
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
