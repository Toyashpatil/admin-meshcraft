import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import authContext from '../context/authContext';
import SideBar from '../components/SideBar';

const Layout = () => {
  const location = useLocation();
  const { isSidebarOpen, setIsSidebarOpen } = useContext(authContext);
  
  // Define the login page's pathname. Adjust this if your login route is different.
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='bg-[#1A1B41] w-[100vw] min-h-screen'>
      <div className='flex items-start gap-2'>
       
        {!isLoginPage && (
          isSidebarOpen ? (
            <div className={`bg-[#2b2e4a] cursor-pointer ${isSidebarOpen ? 'slideInAnimation' : 'slideOutAnimation'}`}>
              <SideBar setState={setIsSidebarOpen} />
            </div>
          ) : (
            <div 
              onClick={() => setIsSidebarOpen(prev => !prev)} 
              className="flex pl-4 pt-4 items-start justify-end"
            >
              <FaBars className="text-xl cursor-pointer text-white hover:text-gray-300 transition-all" />
            </div>
          )
        )}
        <div className='p-3 w-full overflow-auto'>
       
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
