import { useState } from 'react'

import './App.css'
import SideBar from './Components/SideBar/SideBar'
import MainContent from './Components/MainCon/MainContent'

function App() {

  return (
    <>
      <div class=" flex bg-[#171717]">
        <div className='h-screen'>
          <SideBar />
        </div>
        <div class="grow">
          <MainContent />
        </div>
      </div>
    </>
  )
}

export default App
