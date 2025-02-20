import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const createOrder = async (amount, receipt, email) => {
  try {
    const response = await api.post('/api/payment/create-order', {
      amount,
      receipt,
      email
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to create order');
  }
};

export const verifyPayment = async (paymentData, ticketDetails, email) => {
  try {
    const response = await api.post('/api/payment/verify-payment', {
      ...paymentData,
      ticketDetails,
      email
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Payment verification failed');
  }
}; 