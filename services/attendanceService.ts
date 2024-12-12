import axios from 'axios';

const API_URL = 'https://your-backend-url.com';

export const markAttendance = async (photoUri: string, location: { latitude: number; longitude: number }) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, {
      photoUri,
      location,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
  }
};
