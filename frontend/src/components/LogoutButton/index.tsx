import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice'; // Import your logout action

const Logout = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      if (!email || !token) {
        setMessage('User is not logged in');
        return;
      }

      console.log('Email from localStorage:', email);

      const response = await axios.get(`http://localhost:8000/logout?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('email');

        // Update the Redux state to reflect the user is logged out
        dispatch(logout());

        // Redirect to login page after showing the message for 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
};

export default Logout;
