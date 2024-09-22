import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';
import { BiLockAlt } from 'react-icons/bi';
import AuthContext from '../context/AuthContext';

export default function SignInPage() {
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const [email, setEmail] = useState('');    // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(null);    // State for error messages
  const navigate = useNavigate();              // Used to programmatically navigate between routes

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    try {
      // Attempt login
      const user = await login(email, password);  // Get user object, including role

      // Debugging: Check the user's role
      console.log("User role:", user.role);

      // Check user role and navigate accordingly
      if (user.role === 'admin') {
        navigate('/admin-dashboard');  // Redirect to Admin Dashboard if the user is an admin
      } else if (user.role === 'government official') {
        navigate('/government-official-dashboard');  // Redirect to Government Official Dashboard if the user is a government official
      } else {
        navigate('/user-dashboard');  // Redirect to User Dashboard for all other users
      }
    } catch (err) {
      setError('Invalid email or password');  // Show error message if login fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
      <div className="bg-[#686D76] bg-opacity-75 p-8 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md mx-4">
        <h2 className="text-3xl font-semibold text-[#EEEEEE] mb-6" style={{ fontFamily: 'monospace' }}>Sign In</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Display error message if any */}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <InputField 
            icon={<AiOutlineMail />} 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={setEmail} 
          />
          <InputField 
            icon={<BiLockAlt />} 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={setPassword} 
          />

          <button 
            type="submit"
            className="w-full p-3 bg-[#DC5F00] text-white rounded-lg hover:bg-black transition duration-300 mt-4"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 w-full">
          <p className="text-gray-300">Or sign in with:</p>
          <div className="flex justify-center mt-4 space-x-4">
            <button className="bg-[#DC5F00] text-white py-2 px-4 rounded-lg hover:bg-black transition duration-300">Google</button>
            <button className="bg-[#DC5F00] text-white py-2 px-4 rounded-lg hover:bg-black transition duration-300">Facebook</button>
          </div>
        </div>

        <div className="mt-6">
          <a href="/signup" className="text-gray-300 hover:underline">Don't have an account? Sign Up</a>
        </div>
      </div>
    </div>
  );
}

// InputField component to handle form inputs
function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
      />
    </div>
  );
}
