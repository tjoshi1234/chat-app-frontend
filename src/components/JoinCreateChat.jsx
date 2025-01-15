import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomAPI, joinRoomAPI } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {

    const [detail,setDetail] = useState({
        roomId: "",
        userName: ""
    });

    const navigate = useNavigate();

    const { roomId, currUser, connected, setRoomId, setCurrUser, setConnected } = useChatContext();

    function handleFormInputChange(event){
        // console.log(event.target.value);
        setDetail({
            ...detail,
            [event.target.name]:event.target.value
            
        })
    }

    function validateForm(){
        if(detail.roomId === "" || detail.userName === ""){
            toast.error("Invalid Input fields !!")
            return false;
        }
        return true;
    }

    async function joinChat(){
        if(validateForm()){
            try {
                const response = await joinRoomAPI(detail.roomId)
                toast.success("Room joined successfully !!")
                setCurrUser(detail.userName)
                setConnected(true)
               setRoomId(response.roomId)
               console.log(response)
                navigate('/chat')
            } catch (error) {
               // console.log(error)
                if(error.status == 400){
                    toast.error(error.response.data)
                }
            }
        }
    }

   async function createRoom(){
        if(validateForm()){
            // call API to create room on backend
            try {
               const response = await createRoomAPI(detail.roomId)
               console.log(response);
               toast.success("Room created successfully !!")
               setRoomId(response.roomId)
               setCurrUser(detail.userName)
               setConnected(true)
               // forward the user to the chat page

               navigate('/chat')
            } catch (error) {
                console.log(error);
                if(error.status == 400){
                    toast.error("Room id already exists !!")
                }
                else{
                toast.error("Error in creating room");
                }
                
            }
        }
    }

    return <div className="min-h-screen flex items-center justify-center">
        <div className="p-10 dark:border-gray-700 border flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
            <h1 className="text-2xl font-semibold text-center">
                Join Room / Create Room
            </h1>
            {/* name-div */}
            <div>
                <label htmlFor="name" className="block font-medium mb-2">
                    Your Name
                </label>
                <input type="text" id="name" className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleFormInputChange}
                value={detail.userName}
                name="userName"
                placeholder="Enter Your Name"></input>
            </div>

            {/* room-id-div */}
            <div>
                <label htmlFor="name" className="block font-medium mb-2">
                    Room ID / New Room ID
                </label>
                <input type="text" id="name" className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                placeholder="Enter RoomID"></input>
            </div>

            {/* buttons */}

            <div className="flex justify-center gap-2 mt-4">
                <button className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full" onClick={joinChat}>Join Room</button>
                <button className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full" onClick={createRoom}>Create Room</button>
            </div>

        </div>
    </div>
}

export default JoinCreateChat;