import React,{useContext, useState} from 'react'

import routes from './routes/route'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SideBar from './components/SideBar'
import { FaBars } from 'react-icons/fa'
import authContext from './context/authContext'

const App = () => {
  const routings = createBrowserRouter(routes)
  const {isSidebarOpen,setIsSidebarOpen} = useContext(authContext)
  return (
    <div className='bg-[#1A1B41] w-[100vw] h-fit h-min-[100vh] ' >
      <div className='flex item-center gap-2 justify-between '>
        {isSidebarOpen ? <div className={` bg-[#2b2e4a] cursor-pointer ${isSidebarOpen ? 'slideInAnimation' : 'slideOutAnimation'}`}>
          <SideBar setState={setIsSidebarOpen}/>
        </div> : <div onClick={()=>{setIsSidebarOpen((prev)=>!prev)}} className="flex pl-4 pt-4 items-start justify-end">
                    <FaBars className="text-xl cursor-pointer text-white hover:text-gray-300 transition-all" />
                  </div>} 
        <div className=' p-3 w-[85vw] h-fit overflow-scroll '>
          <RouterProvider router={routings}></RouterProvider>
        </div>
      </div>
    </div>
  )
}

export default App