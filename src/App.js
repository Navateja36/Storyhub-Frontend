import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
// import Post from './components/PostCard '
import Postfeedpage from './pages/PostFeedPage '
import Createpost from './pages/CreatePost';
import Postdetailpage from './pages/Postdetailpage';
import Profile from './pages/Profile';
import UpdatePost from './pages/UpdatePost'
import Navbar from './components/Navbar';

function App() {
    return (
        <div>
            <Router>
            <Navbar/>
                <Routes>
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/" element={<Postfeedpage />} />
                    <Route path="/Create" element={<Createpost />} />
                    <Route path='/:postId' element={<Postdetailpage/>} />
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/editpost/:postId' element={<UpdatePost/>}/>

                </Routes>
            </Router>
        </div>
    );
}

export default App;