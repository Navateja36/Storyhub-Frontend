import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom'; 

const baseurl = `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`;

export default function Register() {
    const navigate =useNavigate();
    const [formdata,setFormdata]=useState({
        name:'',
        email:'',
        password:''
    })
    const [loading,setLoading]=useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handlesubmit=async(e)=>{
        e.preventDefault();
        try{
            const response= await fetch(baseurl,{
                method:'post',
                headers :{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formdata),
                
            });
            const data=await response.json()
            if(response.ok){
                //token storing in localstorage
                if(data.token){
                    localStorage.setItem('toekn',data.token);
                }
                setStatusMessage(`Success! User created. Navigating to Login...`);
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            }else {
                setStatusMessage(`Error: ${data.message || 'Registration failed.'}`);
            }
            // console.log(data);
        }
        catch(error){
            setStatusMessage('Network Error: Could not reach the backend server.');
            console.log(error);   
        }finally {
            setLoading(false);
        }
    }
  return (
    <div className="register-container">
        <h1>Register Account</h1>
        <form onSubmit={handlesubmit}>
            <input type="text" name="name" placeholder="Enter username" value={formdata.name} onChange={(e)=>setFormdata(prev=>({...prev,[e.target.name]:e.target.value}))} />
            <input type="text" name="email" placeholder="Enter email" value={formdata.email} onChange={(e)=>setFormdata(prev=>({...prev,[e.target.name]:e.target.value}))} />
            <input type="password" name="password" placeholder="Enter password" value={formdata.password} onChange={(e)=>setFormdata(prev=>({...prev,[e.target.name]:e.target.value}))} />
            <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Sign Up'}</button>
            <h5 className="login-divider" style={{marginLeft:'190px'}}>or</h5>
            <button onClick={()=>navigate('/login')}>Login</button>
        </form>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>

  )
}
