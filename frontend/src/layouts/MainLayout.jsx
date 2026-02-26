import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[16vw] h-screen sticky top-0 ">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-[84vw] h-screen overflow-y-auto">
        <Outlet />
      </div>

    </div>
  )
}

// function MainLayout() {
//   return (
//     <div className='flex'>
//       <div className='w-[16vw] '>
//         <Sidebar />
//       </div>

//       <div className='w-[84vw] '>
//         <Outlet />
//       </div>
//     </div>
//   )
// }

export default MainLayout