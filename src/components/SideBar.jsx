import React,{useContext} from 'react'
import {
  FaThLarge,
  FaUsers,
  FaMoneyBill,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars, // <-- Add this import
} from 'react-icons/fa'

import Logo from "../assets/Horizontalwithbgsmall.png"

import { MdClose } from 'react-icons/md'


import { HiX } from 'react-icons/hi'
import authContext from '../context/authContext'






const navItems = [
  { id: 'addassets',   label: 'Add Assets',   icon: FaThLarge     },
  { id: 'editassets',  label: 'Edit Assets',  icon: FaUsers       },
  { id: 'deleteassets',label: 'Delete Assets',icon: FaMoneyBill    },
  { id: 'profile',     label: 'Profile',     icon: FaCog         },
]

const SideBar = () => {
  const [activeItem, setActiveItem] = React.useState('dashboard')
  const {isSidebarOpen,setIsSidebarOpen} = useContext(authContext)
  

  


  return (
    <div className="text-white h-[100vh] w-64 flex flex-col justify-between">
      {/* Logo / Brand Area */}
      <div>
        <div className="flex items-center justify-between px-5 py-6">
          <div>
            <img src={Logo} alt="MeshCraft Logo" />
          </div>
          {/* Replace the "H" with a hamburger icon */}
          <div className="flex items-center justify-end">
            <MdClose onClick={()=>{
              setIsSidebarOpen((prev)=>!prev)}} className="text-xl cursor-pointer hover:text-gray-300 transition-all" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="flex flex-col space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = (localStorage.getItem("activeBtn") === item.id)

              return (
                <li
                  key={item.id}
                  onClick={() => localStorage.setItem("activeBtn",item.id)}
                  // Smooth transitions
                  className={`
                    flex items-center gap-3 px-5 py-2 cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${
                      isActive
                        ? 'bg-[#383b5b] rounded-r-full mx-3 shadow-inner'
                        : 'hover:bg-white/10'
                    }
                  `}
                >
                  <Icon />
                  <a href={`/${item.id}`} className="text-sm">{item.label}</a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      {/* <div className="m-4">
        <button
          className="
            w-full bg-white text-[#2b2e4a]
            flex items-center justify-center gap-2 py-2 rounded-lg
            hover:bg-gray-100 transition-all duration-300
          "
        >
          <FaSignOutAlt />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div> */}
    </div>
  )
}

export default SideBar
