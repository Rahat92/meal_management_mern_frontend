import React, { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { format } from "timeago.js";

import { useGetConversationsQuery } from "../features/Chat/chatApi";
import { useSelector } from "react-redux";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../features/messages/messageApi";

const Conversation = () => {
  const inputRef = useRef();
  const socket = useRef();
  const [conversationId, setConversationId] = useState();
  const [currentFirend, setCurrentFriend] = useState();
  const [msg, setMsg] = useState("");
  const [isSkip, setIsSkip] = useState(false);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [socketMessage, setSocketMessage] = useState({});
  const { user } = useSelector((state) => state.auth);

  const { data: conversations } = useGetConversationsQuery({ id: user?._id });
  const { data: messages, isSuccess } = useGetMessagesQuery(conversationId, {
    skip: !isSkip,
  });

  useEffect(() => {
    if (isSuccess && messages) {
      setCurrentMessages(messages.data.messages);
    }
  }, [messages ]);
  const [createMessage, {}] = useCreateMessageMutation();

  useEffect(() => {
    socket.current = io("ws://192.168.0.104:5000");
    socket.current.on("getMessage", (data) => {
      setSocketMessage({
        sender: data.sender,
        message: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    if (socketMessage.sender === currentFirend?._id) {
      setCurrentMessages([...currentMessages, socketMessage]);
    }
  }, [socketMessage]);
  console.log(currentMessages);
  useEffect(() => {
    if (user?._id) {
      socket.current.emit("addUser", user?._id);
    }
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);
  useEffect(() => {
    if (conversationId) {
      setIsSkip(true);
    }
    return () => {
      setIsSkip(false);
    };
  }, [conversationId]);

  useEffect(() => {
    inputRef.current.focus();
  }, [conversationId]);
  console.log(currentFirend);

  const inputValueHandler = (e) => {
    setMsg(e.target.value);
  };


  return (
    <div className="w-screen h-screen flex bg-green-400 relative">
      <div className="w-1/3 bg-red-500 h-full">
        {conversations?.data?.chatFrnds?.map((el, index) => {
          return (
            <div
              onClick={() => {
                inputRef.current.focus();
                setConversationId(
                  conversations?.data?.conversations[index]._id
                );
                setCurrentFriend(el);
              }}
              key={el._id}
              className={`bg-green-500 border-b-2 border-r-2${
                index === 0 && "border-t-2"
              } p-2 cursor-pointer hover:bg-green-600`}
            >
              {el.name}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col w-full items-center h-full relative">
        <div className="flex flex-col w-3/4 m-auto absolute top-0 h-[90%] bg-red-500 overflow-auto">
          {currentMessages?.map((el) => {
            return (
              <div
                style={{
                  alignSelf:
                    el.sender === user?._id ? "flex-end" : "flex-start",
                }}
                className="text-black mt-2 p-2 flex items-center"
              >
                <span className="flex justify-center items-center w-[2.5rem] h-[2.5rem] bg-gray-500 rounded-full me-2">
                  <b>
                    {user?._id === el.sender
                      ? user?.name && user.name[0]
                      : currentFirend?.name[0]}
                  </b>
                </span>
                <div className="flex flex-col items-end">
                  <span>{el.message}</span>
                  <span className="text-sm">{format(el.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <input
          onKeyPress={(e) => {
            if (e.key === "Enter" && msg.length > 0) {
              // console.log("Hello world");
              createMessage({
                conversationId,
                sender: user?._id,
                message: msg,
              });
              socket.current.emit("sendMessage", {
                sender: user?._id,
                receiver: currentFirend._id,
                text: msg,
              });
            }
          }}
          ref={inputRef}
          onChange={inputValueHandler}
          className="text-black w-3/4 mt-auto p-4 fixed bottom-0 block h-[10%] absolute bottom-0"
          type="text"
        />
      </div>
    </div>
  );
};

export default Conversation;
