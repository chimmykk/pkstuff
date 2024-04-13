"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiSend } from 'react-icons/fi'; // Import the send icon

export default function Chat() {

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [options] = useState([
    "Check student's attendance",
    "Check student's result",
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [messageResponsePairs, setMessageResponsePairs] = useState<any>([]);

  const handleAvatarClick = () => {
    setIsChatOpen(!isChatOpen);
    setSelectedOption(null); // Reset selected option when closing chat
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container when messageResponsePairs change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageResponsePairs]);

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    if (option === "Check student's attendance") {
      window.location.href = 'http://localhost:3000/attendance-records';
    } else if (option === "Check student's result") {
      // Show loading indicator
      setMessageResponsePairs([...messageResponsePairs, { message: option, response: 'Typing...' }]);
      setInputValue(''); // Clear input value
  
      // Simulate loading with a setTimeout
      setTimeout(() => {
        let newResponse = `To check student's result, please click <a href="http://localhost:3000/exam-results"><span class="attendance-link">here</span></a>.`;
        // Replace the last message in the array with the actual response
        setMessageResponsePairs((prevMessages: any) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // Remove the loading message
          updatedMessages.push({ message: option, response: newResponse });
          return updatedMessages;
        });
      }, 2000); // 3000 milliseconds = 3 seconds
    }
  };
  
  const handleSendClick = () => {
    if (inputValue.trim() !== '') {
      // Show loading indicator
      setMessageResponsePairs([...messageResponsePairs, { message: inputValue, response: 'Typing...' }]);
      setInputValue(''); // Clear input value
  
      // Simulate loading with a setTimeout
      setTimeout(() => {
        let newResponse;
        if (inputValue.toLowerCase().includes('attendance')) {
          newResponse = `To check attendance, please click <a href="http://localhost:3000/attendance-records"><span class="attendance-link">here</span></a>.`; 
        } else if (inputValue.toLowerCase().includes('result')) {
          newResponse = `To check student's result, please click <a href="http://localhost:3000/exam-results"><span class="attendance-link">here</span></a>.`;
        } else {
          newResponse = 'Cannot find context.';
        }
        // Replace the last message in the array with the actual response
        setMessageResponsePairs((prevMessages: any) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // Remove the loading message
          updatedMessages.push({ message: inputValue, response: newResponse });
          return updatedMessages;
        });
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  };
  

  return (
    <main className=''>
      <Avatar onClick={handleAvatarClick}>
        {isChatOpen ? (
          <button className='cursor-pointer bg-[#2464EA] flex justify-center items-center h-full w-full shrink-0 overflow-hidden rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        ) : (
          <AvatarImage className='bg-[#2464EA] p-2 ' src="/chat.svg" />
        )}
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {isChatOpen && (
        <div className='fixed right-0 bottom-0 md:right-8 md:mb-12 md:bottom-12 overflow-y-hidden'>
          <div className="relative flex flex-col gap-4 md:rounded-lg shadow-md h-screen w-screen md:h-[600px] md:w-[400px] z-30 bg-white">
            <div className='md:rounded-t-lg flex justify-between py-2 px-4 bg-[#2464EA] text-white font-medium'>
              <h1 className=''>Assistant Bot</h1>
              <button className='cursor-pointer bg-[#2464EA]' onClick={handleAvatarClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Chat messages and responses container */}
            <div className="overflow-y-auto flex-1 pb-20">
              <div className='text-base bg-[#EFF4FF] p-4 rounded-lg mx-2'>
                Hello! How can I assist you today?
              </div>

              {/* Display options */}
              {!messageResponsePairs.length && (
                <div className='flex gap-2 justify-end mx-2 flex-wrap'>
                  {selectedOption ? (
                    <button className='text-sm text-white bg-[#2464EA] p-2 mt-2 w-fit rounded-lg'>
                      {selectedOption}
                    </button>
                  ) : (
                    options.map((option, index) => (
                      <button key={index} className='text-sm text-white bg-[#2464EA] p-2 mt-2 w-fit rounded-lg' onClick={() => handleOptionClick(option)}>
                        {option}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Display previous messages with responses */}
              {messageResponsePairs.map((pair: any, index: number) => (
  <div className='flex flex-col gap-3' key={index}>
    <div className='text-base self-end text-white bg-[#2464EA] p-2 mx-2 mt-3 w-fit rounded-lg'>
      {pair.message}
    </div>
    {pair.response === 'Cannot find context.' ? (
      <div className='text-base bg-[#EFF4FF] flex flex-col p-4 rounded-lg mx-2'>
        {pair.response}
        {options.map((option, index) => (
          <button key={index} className='text-sm text-white bg-[#2464EA] p-2 mt-2 w-fit rounded-lg' onClick={() => handleOptionClick(option)}>
            {option}
          </button>
        ))}
      </div>
    ) : (
      <div className='text-base bg-[#EFF4FF] p-4 rounded-lg mx-2' dangerouslySetInnerHTML={{ __html: pair.response }}></div>
    )}
  </div>
))}
    <div ref={messagesEndRef} />
            </div>

            {/* Input element */}
            <div className="absolute bottom-0 w-full flex items-center justify-center border-t p-4 bg-white border-[#dfdfdf]">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow outline-none mx-2 text-base"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <FiSend className='text-[#2464EA] cursor-pointer' onClick={handleSendClick} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
