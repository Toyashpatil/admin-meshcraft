import React,{useContext, useState} from 'react'

import routes from './routes/route'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SideBar from './components/SideBar'
import { FaBars } from 'react-icons/fa'
import authContext from './context/authContext'

const App = () => {
  const routings = createBrowserRouter(routes)

  return (
    <div className='bg-[#1A1B41] ' >
      
        
        <div className=' pt-1  h-fit overflow-scroll '>
          <RouterProvider router={routings}></RouterProvider>
        </div>
      
    </div>
  )
}

export default App