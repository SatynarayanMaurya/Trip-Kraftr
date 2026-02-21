import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className='flex'>
      <div className='w-[16vw] '>
        <Sidebar />
      </div>

      <div className='w-[84vw] '>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout