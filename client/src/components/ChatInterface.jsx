import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { getMuseumInfo, getTicketPrices, getGuidedTours, getFacilities } from '../utils/museumUtils';

const ChatInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Welcome to Museum AI Assistant! Please choose an option:
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫

Enter a number (1-6) to learn more.`
    }
  ]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio setup
  const messageSound = new Audio('/message.mp3');

  const playMessageSound = () => {
    messageSound.currentTime = 0;
    messageSound.play().catch(e => console.log('Audio play failed:', e));
  };

  const handleBooking = async (ticketType) => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: ticketType.price * 100,
      currency: 'INR',
      name: 'Museum Ticket',
      description: `${ticketType.type} Ticket - ${ticketType.description}`,
      handler: function(response) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `✅ Payment successful! Your ticket confirmation will be sent to your email shortly.
          
What else would you like to know?
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`
        }]);
        playMessageSound();
      },
      prefill: {
        email: '',
        contact: ''
      },
      theme: {
        color: '#10B981'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const processUserQuery = (query) => {
    const option = parseInt(query);
    
    switch(option) {
      case 1: {
        const info = getMuseumInfo();
        return `🕒 Museum Hours & Location:\n\nWe are open ${info.contact.hours}\nLocation: ${info.location}\n\nWhat else would you like to know?\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
      }
      
      case 2: {
        const tickets = getTicketPrices();
        return `🎫 Ticket Prices:\n\n${tickets.map(ticket => 
          `${ticket.type} (${ticket.ageRange}): ₹${ticket.price}`
        ).join('\n')}\n\nTo book tickets, select option 6.\n\nWhat else would you like to know?\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
      }
      
      case 3: {
        const tours = getGuidedTours();
        return `🎯 Available Guided Tours:\n\n${tours.map(tour => 
          `${tour.name}\n• Duration: ${tour.duration}\n• Price: ₹${tour.price}\n• Times: ${tour.schedule.join(' & ')}\n`
        ).join('\n')}\n\nWhat else would you like to know?\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
      }
      
      case 6: {
        const tickets = getTicketPrices();
        return `🎫 Select a ticket type to book:\n\n${tickets.map((ticket, index) => 
          `${index + 1}. ${ticket.type} (${ticket.ageRange}): ₹${ticket.price}\n   ${ticket.description}`
        ).join('\n')}\n\nEnter ticket number to proceed with booking.`;
      }
      
      case 4: {
        const facilities = getFacilities();
        return `🏛️ Our Facilities & Amenities:\n\n${facilities.amenities.join('\n')}\n\nWhat else would you like to know?\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
      }
      
      case 5: {
        const facilities = getFacilities();
        return `🅿️ Parking Information:\n\n${facilities.parking.available ? 'Parking is available' : 'Parking is not available'}\n• Rate: $${facilities.parking.hourlyRate}/hour\n• Maximum duration: ${facilities.parking.maxDuration}\n\nWhat else would you like to know?\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
      }
      
      default:
        return `I'm sorry, I don't understand that option. Please choose a number between 1-6:\n
1. Museum Hours & Location
2. Ticket Prices
3. Guided Tours
4. Facilities & Amenities
5. Parking Information
6. Book Tickets Now 🎫`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setMessage('');
    
    // Process the response
    setTimeout(() => {
      const response = processUserQuery(userMessage);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response
      }]);
      playMessageSound(); // Only play sound for bot responses
    }, 1000);
  };

  return (
    <motion.div
      id="chat-interface"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 right-0 mb-0 mr-4 bg-gray-900 rounded-t-2xl shadow-2xl w-[380px] transition-all duration-300 ${
        isExpanded ? 'h-[600px]' : 'h-[64px]'
      }`}
    >
      <div 
        className="p-4 border-b border-gray-700 cursor-pointer flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-sm font-bold">AI</span>
          </motion.div>
          <h3 className="font-semibold text-white">Museum Assistant</h3>
        </div>
        <motion.div 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-5 h-5 flex items-center justify-center"
        >
          <span className="text-gray-400">▼</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100%-64px)]"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg p-3 max-w-[80%] whitespace-pre-line shadow-lg ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700 mt-auto bg-gray-800 bg-opacity-50">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a number (1-6)..."
                  className="w-full pr-12 pl-4 py-3 rounded-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-emerald-600 transition-colors shadow-lg"
                >
                  <PaperAirplaneIcon className="w-4 h-4 transform rotate-90" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatInterface; 