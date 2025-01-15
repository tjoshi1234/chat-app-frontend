import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";


let ChatPage = () => {

    const navigate = useNavigate()

    const { roomId, currUser, connected } = useChatContext();

    // console.log(roomId);
    // console.log(currUser);
    // console.log(connected);

    useEffect(()=>{
        if(!connected){
        navigate('/')
        }
    },[roomId,currUser,connected])
    

const [messages,setMessages] = useState([])
const [input,setInput] = useState("")
const inputRef = useRef(null)
const chatBoxRef = useRef(null)
const [stompClient,setstompClient] = useState(null)


// Page init : 
// load messages from the db

useEffect(()=>{
    async function loadMessages(){

        try {
            const oldmessages = await getMessages(roomId)
           // console.log(`hiiiiiiiii`+oldmessages);
            setMessages(oldmessages)
            
        } catch (error) {
            
        }
    }
    loadMessages()
}
,[])

// stompClient connection establish in init
    // subscribe

    useEffect(()=>{

        const connectWebSocket = () => {

            /// SockJS

            // making the socket
            const socket = new SockJS(`${baseURL}/chat`)

            const client = Stomp.over(socket)

            client.connect({},()=>{
                setstompClient(client)

                toast.success("Connected")

                client.subscribe(`/topic/room/${roomId}`,(message) => {
                    console.log((message));

                    const newMessage = JSON.parse(message.body)
                    setMessages((prev) => [...prev,newMessage])
                    
                })
            })
        }
        connectWebSocket()
    },[roomId])


    // stomp client



// send message handle

const sendMessage = async () => {
    if(stompClient && connected && input.trim()){
        
        const message = {
            sender: currUser,
            content: input,
            roomId: roomId
        }

        stompClient.send(`/app/sendMessage/${roomId}`,
            {},
            JSON.stringify(message)
        )
        setInput('')
    }
}


    return <>
    <div className="">
        {/* header section */}
        <header className="dark:border-gray-700 h-20 fixed w-full dark:bg-gray-900 py-shadow py-5 flex justify-around items-center">
            <div>
                {/* room name container */}
                <h1 className="text-xl font-semibold">
                    Room : <span>Family Room</span>
                </h1>
            </div>
            <div>
                {/* username container */}
                <h1 className="text-xl font-semibold">
                    User : <span>Tapan Joshi</span>
                </h1>
            </div>
            <div>
                {/* leave room button */}
                <button className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full">Leave Room</button>
            </div>
        </header>

        <main className="py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto">
            {/* <div className="message_container"></div> */}
            {
                messages.map((message,index)=>(
                    <div key={index} className={`flex ${message.sender === currUser ? "justify-end" : "justify-start"}`}>
                        <div className={`my-2 ${message.sender === currUser ? "bg-purple-600" : "bg-blue-600"} p-2 max-w-xs rounded`}>
                        <div className="flex flex-row gap-2">
                            <img className="h-10 w-10" src="https://api.multiavatar.com/Binx Bond.svg" alt="User"></img>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-bold">{message.sender}</p>
                            <p>{message.content}</p>
                        </div>
                        </div>

                    </div>
                    </div>
                ))
            }
        </main>

        {/* send messages section */}
        <div className="fixed bottom-4 w-full h-16">
            <div className="h-full pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
                <input type="text" placeholder="Type a message..." className="px-3 dark:border-gray-600 w-full dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none" 
                value={input}
                onChange={(e)=>{
                    setInput(e.target.value)
                }}/>
                <div className="flex gap-1">
                <button className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full">
                    <MdAttachFile size={20}/>
                </button>
                <button className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full"
                onClick={sendMessage}>
                    <MdSend size={20}/>
                </button>
                </div>
            </div>
        </div>
    </div>
    </>
}

export default ChatPage;