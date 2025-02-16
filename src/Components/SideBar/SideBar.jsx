
import useChat from '@/store/useChat';
import { MoreHorizontalIcon, SidebarClose } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

const SideBar = () => {
    const sidebarRef = useRef(null)

    const { isSidebarOpen, setSidebarOpen } = useChat();

    const handleSidebar = () => {
        setSidebarOpen(!isSidebarOpen)
    }

    const handleClickOutside = (event) => {
        if (window.innerWidth < 1024) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    useEffect(() => {
        const handleSize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false)
            }
            if (window.innerWidth > 1024) {
                setSidebarOpen(true)
            }
        }
        handleSize()
        window.addEventListener('resize', handleSize)
        return () => {
            window.removeEventListener('resize', handleSize)
        }
    }, [])



    return (
        <>
            <div ref={sidebarRef} className={` ${isSidebarOpen ? 'w-72 p-5 ' : 'w-0 p-0 invisible '}  lg:relative absolute z-10  lg:flex flex-col transition-all duration-300  h-[100%] container bg-[#0d0d0d] `}>

                <div className={`flex flex-row ${isSidebarOpen ? ' ' : 'hidden'} animate__animated animate__fadeIn w-full justify-between h-fit items-center `}>
                    <p className='text-white '>Bhai Bhai</p>
                    {
                        isSidebarOpen && (
                            <>
                                {/* <div className={` ${isSidebarOpen ? 'ms-1' : 'ms-5'} `}>
                                        <p className='text-3xl font-bold text-white'>Sun.ai</p>
                                    </div> */}
                                <div className='flex '>
                                    <SidebarClose onClick={handleSidebar} className={`${isSidebarOpen ? '' : ''} text-white size-10 hover:bg-[#ffffff26] hover:text-white transition-all duration-300 cursor-pointer rounded-xl p-[7px] `} />
                                </div>
                            </>
                        )
                    }

                </div>
                <div className={`mt-5 ${isSidebarOpen ? '' : 'hidden'} animate__animated animate__fadeIn`}>
                    <div className='bg-[#ffffff26] flex justify-between items-center rounded-lg px-3 py-2'>
                        <p className='text-white'>New Chat</p>
                        <MoreHorizontalIcon className='text-white cursor-pointer size-5' />
                    </div>

                </div>
            </div>
        </>
    )
}

export default SideBar