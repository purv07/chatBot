import {create} from 'zustand'

const useChat=create((set)=>({
    isSidebarOpen:true,
    setSidebarOpen:(isSidebarOpen)=>set({isSidebarOpen})
}))

export default useChat
