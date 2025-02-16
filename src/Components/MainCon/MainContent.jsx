import { ArrowBigUp, ArrowUp, Globe, Image, MoveDiagonal, SidebarOpen, VideoIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import useChat from '@/store/useChat';
import logo from '../../assets/img/Sun.ai.png'
import { ScrollArea } from "@/components/ui/scroll-area"
import './CssMainCon.css'
import autoprefixer from 'autoprefixer';
import 'animate.css';
import axios from 'axios';

const MainContent = () => {
    const { isSidebarOpen, setSidebarOpen } = useChat();
    const [message, setMessage] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [botMsg, setBotMsg] = useState("");
    const textRef = useRef(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [AllData, setAllData] = useState([]);
    const [res, setRes] = useState('');



    useEffect(() => {
        const data = [
            {
                id: 1,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 2,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 3,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 4,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 5,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 6,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 7,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 8,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 9,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 10,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 8,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            },
            {
                id: 9,
                msg: "Hello,I am Purv Virpariya",
                type: "user"
            },
            {
                id: 10,
                msg: "Hi Purv! Nice to meet you. How's your day going? 😊",
                type: "bot"
            }
        ]
        setAllData(data)
        setTimeout(() => {
            scrollToBottom()
        }, 500);
    }, [])


    const viewportRef = useRef(null);


    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (viewportRef.current) {
            const viewport = viewportRef.current;
            viewport.scrollTop = viewport.scrollHeight; // Scroll to the bottom
        }
    };

    const handleSidebar = () => {
        setSidebarOpen(!isSidebarOpen)
    }

    const handleKeyDown = (e) => {
        if (window.innerWidth > 1024) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setFullScreen(true)
                setUserMsg((prev) => prev + "\n")
                setMessage((prev) => prev + "\n");
            } else if (e.key === 'Enter') {
                scrollToBottom()
                handleSubmitPrompt();
            }
        }
    }
    const handleInput = (e) => {
        setMessage(e.target.value);
        setUserMsg(e.target.value);
        if (textRef.current) {
            textRef.current.style.height = "auto";
            textRef.current.style.height = `${textRef.current.scrollHeight}px`;
        }
    }

    const handleSubmitPrompt = () => {
        if (userMsg.trim() !== "") {
            setFullScreen(false)
            setAllData((prev) => [...prev, {
                id: prev.length + 1,
                msg: userMsg,
                type: "user",
            }])
            handleApiCall(userMsg);
            setTimeout(() => {
                scrollToBottom()
                setUserMsg("")
            }, 300);
        }
    }

    const handleApiCall = async (prompt) => {
        try {
            const response = await fetch('http://localhost:11434/api/generate?stream=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama2:7b-chat-q4_K_S",
                    prompt: prompt,
                    stream: true,
                    max_tokens: 100
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedMessage = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const lines = decoder.decode(value).split("\n");

                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    try {
                        const json = JSON.parse(line);
                        const newChunk = json.response;

                        // Update state with each new chunk
                        setRes((prev) => prev + newChunk);

                        // Also update accumulatedMessage to store the full response
                        accumulatedMessage += newChunk;

                        scrollToBottom()

                    } catch (e) {
                        console.error("Failed to parse JSON:", line);
                    }
                }
            }

            console.log("end of stream");

            // Store the full response in allData after streaming completes
            setAllData((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    msg: accumulatedMessage,
                    type: "bot",
                }
            ]);
            setRes("");

        } catch (error) {
            console.log(error);
        }
    };





    const handleFullScreen = () => {
        setFullScreen(!fullScreen)
    }

    return (
        <>

            <div className='h-screen bg-[#171717] '>


                {/* <img src={logo} className='h-40 bg-cover mix-blend-color-dodge' /> */}
                <div className={` flex items-center px-5 pt-5 `}>
                    {
                        !isSidebarOpen && (
                            <>
                                <div className='flex '>
                                    <SidebarOpen onClick={handleSidebar} className={`${isSidebarOpen ? '' : ''} text-white size-10 hover:bg-[#ffffff26] hover:text-white transition-all duration-300 cursor-pointer rounded-xl p-[7px] `} />
                                </div>

                            </>
                        )
                    }
                    <div className={` ${isSidebarOpen ? 'ms-1' : 'ms-5'} `}>
                        <p className='text-2xl font-bold text-white'>Sun.ai</p>
                    </div>
                </div>



                <div className={`m-5 overflow-hidden`}>
                    <div id='Archived' ref={viewportRef} className={`w-full  scrollbarArchived  overflow-y-auto text-white transition-all duration-300 pe-5 ${fullScreen ? 'h-0' : 'h-[68vh]'}`}>
                        <div className='flex flex-col gap-4 lg:gap-3'>
                            {/* {
                                AllData.map((item) => <>
                                    {
                                        item.type === 'user' ?
                                            (
                                                <div key={item.id} className='flex justify-end'>
                                                    <div className='bg-[#ffffff26] rounded-3xl px-5 py-2 max-w-[50%] min-w-fit '>
                                                        <p>{item.msg}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={item.id} className='flex justify-start'>
                                                    <div className=' rounded-3xl px-5 py-2 '>
                                                        <p>MAP{item.msg}</p>
                                                    </div>
                                                </div>
                                            )
                                    }
                                </>
                                )
                            } */}
                            {
                                AllData.map((item) => <>
                                    <div key={item.id} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-5 py-2 rounded-3xl max-w-[50%] min-w-fit ${item.type === 'user' ? 'bg-[#ffffff26]' : ''}`}>
                                            <p>{item.msg}</p>
                                        </div>
                                    </div>
                                </>
                                )
                            }
                            {
                                res && (
                                    <div className="flex justify-start">
                                        <div className="px-5 py-2 text-white rounded-3xl max-w-[50%] min-w-fit">
                                            <p>{res}</p> {/* Streaming response updates here */}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={` bg-[#ffffff26]  rounded-3xl m-5 transition-all px-5 py-4 duration-300  ${fullScreen ? 'h-[80vh] ' : ''}`}>
                    <div className='flex h-full w-full gap-5'>
                        <div className='flex flex-col justify-between h-full w-full grid-rows-2  gap-3'>
                            <ScrollArea className={`w-full ${fullScreen ? 'h-fit' : 'h-6'} text-white transition-all duration-300 `}>
                                <textarea ref={textRef} value={userMsg} onChange={handleInput} onKeyDown={handleKeyDown} type='text' placeholder='Send a Message'
                                    className={`w-full h-fit scrollbar-hide resize-none  bg-transparent outline-none text-white`} />
                            </ScrollArea>
                            <div className='flex gap-1 '>
                                <div className='flex gap-3 items-center hover:bg-[#ffffff12] transition-all cursor-pointer rounded-lg md:rounded-full p-[6px] md:p-2 text-white'><Globe className='text-white size-5 lg:size-6' /><p className='md:flex transition-all hidden '>Web Search</p></div>
                                <div className='flex gap-3 items-center hover:bg-[#ffffff12] transition-all cursor-pointer rounded-lg md:rounded-full p-[6px] md:p-2 text-white'><Image className='text-white size-5 lg:size-6' /><p className='md:flex transition-all hidden '>Image Generation</p></div>
                                <div className='flex gap-3 items-center hover:bg-[#ffffff12] transition-all cursor-pointer rounded-lg md:rounded-full p-[6px] md:p-2 text-white'><VideoIcon className='text-white size-5 lg:size-6' /><p className='md:flex transition-all hidden '>Video Generation</p></div>
                            </div>
                        </div>
                        {/* Side Button's */}
                        <div className='flex flex-row gap-2'>
                            <div onClick={handleFullScreen} className='bg-[#ffffff26] h-fit hover:bg-[#ffffff12] transition-all cursor-pointer flex items-center justify-center rounded-full p-2'>
                                <MoveDiagonal className='text-white size-4  stroke-[3px]' />
                            </div>
                            <div onClick={handleSubmitPrompt} className='bg-[#ffffff26] hover:bg-[#ffffff12] h-fit transition-all cursor-pointer flex items-center justify-center rounded-full p-2'>
                                <ArrowUp className='text-white size-4  stroke-[3px]' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MainContent