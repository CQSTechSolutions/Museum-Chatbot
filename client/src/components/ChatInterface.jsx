import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { createOrder, verifyPayment } from '../utils/api';

const ChatInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [bookingState, setBookingState] = useState({
    isBooking: false,
    selectedTicketType: null,
    step: 'main'
  });

  const [messages, setMessages] = useState([{
    type: 'bot',
    content: 'Welcome to Museum AI Assistant! How can I help you today?',
    options: [
      { icon: '🎟️', text: 'Book Tickets', action: 'BOOK_TICKETS' },
      { icon: '💰', text: 'Check Ticket Prices', action: 'CHECK_PRICES' },
      { icon: 'ℹ️', text: 'Museum Information', action: 'MUSEUM_INFO' },
      { icon: '🎨', text: 'Special Exhibitions', action: 'EXHIBITIONS' },
      { icon: '🚶', text: 'Guided Tours', action: 'GUIDED_TOURS' },
      { icon: '❌', text: 'Exit Chat', action: 'EXIT' }
    ]
  }]);

  const getTicketPrices = () => [
    { type: 'Adult', price: 200, ageRange: '18+ years', description: 'Full access to all exhibits' },
    { type: 'Child', price: 100, ageRange: '5-17 years', description: 'Kid-friendly tour included' },
    { type: 'Senior', price: 150, ageRange: '60+ years', description: 'Guided tour included' },
    { type: 'Student', price: 150, ageRange: 'With valid ID', description: 'Special student benefits' }
  ];

  const handleOptionClick = async (action, data) => {
    setShowInput(false);
    
    switch(action) {
      case 'BOOK_TICKETS':
        const tickets = getTicketPrices();
        setMessages(prev => [...prev, {
          type: 'bot',
          content: '🎫 Please select a ticket type:',
          options: tickets.map(ticket => ({
            icon: '🎟️',
            text: `${ticket.type} - ₹${ticket.price}`,
            subtext: `${ticket.ageRange} | ${ticket.description}`,
            action: 'SELECT_TICKET',
            data: ticket
          }))
        }]);
        playMessageSound();
        break;

      case 'SELECT_TICKET':
        setBookingState({ 
          isBooking: true, 
          selectedTicketType: data,
          step: 'email-input' 
        });
        setShowInput(true);
        setUserEmail('');
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Please enter your email address to proceed with booking:
${data.type} Ticket
• Price: ₹${data.price}
• ${data.description}
• Age Range: ${data.ageRange}`
        }]);
        playMessageSound();
        break;

      case 'CHECK_PRICES':
        const prices = getTicketPrices();
        setMessages(prev => [...prev, {
          type: 'bot',
          content: '💰 Current Ticket Prices:',
          options: prices.map(ticket => ({
            icon: '🎟️',
            text: `${ticket.type} - ₹${ticket.price}`,
            subtext: `${ticket.ageRange} | ${ticket.description}`,
            action: 'SHOW_MAIN_MENU'
          }))
        }]);
        playMessageSound();
        break;

      case 'SHOW_MAIN_MENU':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'What else would you like to know?',
          options: messages[0].options
        }]);
        playMessageSound();
        break;

      case 'MUSEUM_INFO':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `ℹ️ Museum Information:

• Opening Hours: 9:00 AM - 6:00 PM
• Location: 123 Museum Avenue, Art District
• Contact: +1 (555) 123-4567
• Email: info@museum.com

We are open all days except major holidays.`,
          options: [
            { 
              icon: '🏠', 
              text: 'Back to Main Menu', 
              action: 'SHOW_MAIN_MENU' 
            }
          ]
        }]);
        playMessageSound();
        break;

      case 'EXHIBITIONS':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `🎨 Current Special Exhibitions:

1. Renaissance Masterpieces
• Duration: March 1 - June 30, 2024
• Additional Fee: ₹1000

2. Contemporary Art Showcase
• Duration: April 15 - August 15, 2024
• Additional Fee: ₹800

Book tickets to include special exhibitions!`,
          options: [
            { 
              icon: '🎟️', 
              text: 'Book Tickets', 
              action: 'BOOK_TICKETS' 
            },
            { 
              icon: '🏠', 
              text: 'Main Menu', 
              action: 'SHOW_MAIN_MENU' 
            }
          ]
        }]);
        playMessageSound();
        break;

      case 'GUIDED_TOURS':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `🚶 Available Guided Tours:

1. Art Through Ages
• Duration: 2 hours
• Price: ₹1500
• Times: 10:00 AM, 2:00 PM
• Max Group Size: 15 people

2. Modern Masters
• Duration: 1.5 hours
• Price: ₹1200
• Times: 11:30 AM, 3:30 PM
• Max Group Size: 12 people

Would you like to book a tour?`,
          options: [
            { 
              icon: '📅', 
              text: 'Book a Tour', 
              action: 'BOOK_TICKETS' 
            },
            { 
              icon: '🏠', 
              text: 'Main Menu', 
              action: 'SHOW_MAIN_MENU' 
            }
          ]
        }]);
        playMessageSound();
        break;

      case 'EXIT':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'Thank you for visiting! Have a great day! 👋'
        }]);
        playMessageSound();
        setTimeout(() => {
          setIsExpanded(false);
          setMessages([{
            type: 'bot',
            content: 'Welcome to Museum AI Assistant! How can I help you today?',
            options: [
              { icon: '🎟️', text: 'Book Tickets', action: 'BOOK_TICKETS' },
              { icon: '💰', text: 'Check Ticket Prices', action: 'CHECK_PRICES' },
              { icon: 'ℹ️', text: 'Museum Information', action: 'MUSEUM_INFO' },
              { icon: '🎨', text: 'Special Exhibitions', action: 'EXHIBITIONS' },
              { icon: '🚶', text: 'Guided Tours', action: 'GUIDED_TOURS' },
              { icon: '❌', text: 'Exit Chat', action: 'EXIT' }
            ]
          }]);
          setBookingState({
            isBooking: false,
            selectedTicketType: null,
            step: 'main'
          });
          setUserEmail('');
          setShowInput(false);
        }, 2000);
        break;
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !message.includes('@')) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Please enter a valid email address.',
        options: [
          { 
            icon: '✉️', 
            text: 'Try Again', 
            action: 'SELECT_TICKET',
            data: bookingState.selectedTicketType
          }
        ]
      }]);
      return;
    }

    // Add user's email message
    setMessages(prev => [...prev, {
      type: 'user',
      content: message
    }]);

    const emailToUse = message;
    setUserEmail(emailToUse);
    setMessage('');
    setShowInput(false);
    
    // Immediately proceed with booking using the email we just got
    try {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Creating your order...'
      }]);

      const order = await createOrder(
        bookingState.selectedTicketType.price,
        `ticket_${Date.now()}`,
        emailToUse
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Museum Ticket",
        description: `${bookingState.selectedTicketType.type} Ticket`,
        order_id: order.id,
        handler: async function(response) {
          try {
            setMessages(prev => [...prev, {
              type: 'bot',
              content: 'Verifying payment...'
            }]);

            const verification = await verifyPayment(
              response,
              bookingState.selectedTicketType,
              emailToUse
            );

            if (verification.verified) {
              setMessages(prev => [...prev, {
                type: 'bot',
                content: `✅ Payment successful! Your ticket has been sent to ${emailToUse}.`,
                options: [
                  { 
                    icon: '🏠', 
                    text: 'Return to Main Menu', 
                    action: 'SHOW_MAIN_MENU' 
                  }
                ]
              }]);
              playMessageSound();
              setBookingState({ isBooking: false, selectedTicketType: null, step: 'main' });
            }
          } catch (error) {
            handlePaymentError();
          }
        },
        prefill: {
          email: emailToUse,
          name: "",
          contact: ""
        },
        theme: {
          color: "#10B981"
        },
        modal: {
          ondismiss: function() {
            handlePaymentCancellation();
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      handlePaymentError();
    }
  };

  // Helper functions for error handling
  const handlePaymentError = () => {
    setMessages(prev => [...prev, {
      type: 'bot',
      content: '❌ Payment failed. Would you like to try again?',
      options: [
        { 
          icon: '🔄', 
          text: 'Try Again', 
          action: 'BOOK_TICKETS' 
        },
        { 
          icon: '🏠', 
          text: 'Main Menu', 
          action: 'SHOW_MAIN_MENU' 
        }
      ]
    }]);
    playMessageSound();
  };

  const handlePaymentCancellation = () => {
    setMessages(prev => [...prev, {
      type: 'bot',
      content: 'Payment cancelled. Would you like to try again?',
      options: [
        { 
          icon: '🔄', 
          text: 'Try Again', 
          action: 'BOOK_TICKETS' 
        },
        { 
          icon: '🏠', 
          text: 'Main Menu', 
          action: 'SHOW_MAIN_MENU' 
        }
      ]
    }]);
    playMessageSound();
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio setup with preloading
  const [messageSound] = useState(new Audio('/message.mp3'));
  
  useEffect(() => {
    // Preload the audio file
    messageSound.load();
  }, []);

  const playMessageSound = () => {
    messageSound.currentTime = 0;
    messageSound.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <motion.div
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
                >
                  <div className={`rounded-lg p-4 whitespace-pre-line ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white ml-auto max-w-[80%]'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.options && (
                    <div className="mt-4 space-y-2">
                      {msg.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleOptionClick(option.action, option.data)}
                          className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors duration-200 border border-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{option.icon}</span>
                            <div className="flex-1">
                              <div className="text-white">{option.text}</div>
                              {option.subtext && (
                                <div className="text-sm text-gray-400">{option.subtext}</div>
                              )}
                            </div>
                            <span className="text-gray-400">›</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {showInput && (
              <div className="p-4 border-t border-gray-700 mt-auto bg-gray-800 bg-opacity-50">
                <form onSubmit={handleEmailSubmit} className="relative">
                  <input
                    type="email"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your email..."
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatInterface; 