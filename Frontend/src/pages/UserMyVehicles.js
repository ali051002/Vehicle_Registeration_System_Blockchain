import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import VehicleListItem from '../components/VehicleListItem';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import axios from 'axios';

export default function UserMyVehicles() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  // Fallback vehicles for testing purposes
  const fallbackVehicles = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      registrationDate: '2023-01-01',
      engineNumber: 'EN123456',
      licensePlate: 'ABC-1234',
      color: 'Blue',
      chassisNumber: 'CH123456',
      manufactureYear: 2022,
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      registrationDate: '2023-02-01',
      engineNumber: 'EN654321',
      licensePlate: 'DEF-5678',
      color: 'Red',
      chassisNumber: 'CH654321',
      manufactureYear: 2021,
    },
    // other vehicles...
  ];

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Fetch vehicles for the logged-in user when the component mounts
  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:8085/api/vehicles/user/${user.id}`);
          console.log(response.data); // Logging fetched vehicles
          setVehicles(response.data.length > 0 ? response.data : fallbackVehicles); // Use fallback if no data fetched
        } catch (error) {
          console.error('Error fetching user vehicles:', error);
          setVehicles(fallbackVehicles); // Fallback in case of error
        }
      }
    };

    fetchUserVehicles();

    const timer = setTimeout(() => {
      // Optional animation logic if needed
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]); // The effect depends on the user state

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background animation */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#EADFB4',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
        }}
      />

      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={navOpen} toggleNav={toggleNav} />

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={toggleNav} />

        {/* Page Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">My Vehicles</h1>
          <ul className="space-y-4">
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <VehicleListItem key={vehicle._id || vehicle.id} vehicle={vehicle} owner={user} />
              ))
            ) : (
              <p className="text-[#373A40] text-center">You do not own any vehicles.</p>
            )}
          </ul>
        </main>
      </div>
    </div>
  );
}
