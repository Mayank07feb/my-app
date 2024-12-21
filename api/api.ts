import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for APIs
const BASE_URL = 'https://at.realvictorygroups.xyz/api';

// Utility function to fetch the authentication token
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

// Utility function to store user data and token in AsyncStorage
export const storeUserData = async (user, token) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
    console.log('User data and token saved to AsyncStorage');
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

// Utility function to fetch user data from AsyncStorage
export const getUserData = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('userData');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Utility function to clear user data and token from AsyncStorage
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('token');
    console.log('User data and token removed from AsyncStorage');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Login Function
export const loginUser = async (email, password) => {
  const apiUrl = `${BASE_URL}/login`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Login failed: ${errorResponse}`);
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('Login failed: No token received');
    }

    // Save user data and token to AsyncStorage
    await storeUserData(data.user, data.token);
    console.log('Login successful. User data saved.');
    return data; // Return login data
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error(error.message || 'Error during login');
  }
};

// Fetch Attendance Records for a Day
export const fetchAttendanceData = async (date) => {
  const apiUrl = `${BASE_URL}/attendance/day_wise`;

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Error fetching attendance data: ${errorResponse}`);
    }

    const data = await response.json();
    console.log('Attendance Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching attendance data:', error.message);
    throw new Error(error.message || 'Error fetching attendance data');
  }
};

// Check-In Function
export const checkIn = async (photoUri, location) => {
  const apiUrl = `${BASE_URL}/attendance/check_in`;

  if (!photoUri || !location || !location.latitude || !location.longitude) {
    throw new Error('Photo and valid location are required for check-in');
  }

  try {
    const token = await getAuthToken();
    const userData = await getUserData();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      type: 'image/png',
      name: 'file.png',
    });
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    formData.append('distance', '70m');
    formData.append('user_id', userData?.id || '');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Error response:', errorResponse);
      throw new Error(`Error: ${errorResponse}`);
    }

    const data = await response.json();
    console.log('Check-in response data:', data);
    return data;
  } catch (error) {
    console.error('Error during check-in:', error.message);
    throw new Error(error.message || 'Error during check-in');
  }
};

// Logout Function
export const logoutUser = async () => {
  const apiUrl = `${BASE_URL}/logout`;

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Error during logout: ${errorResponse}`);
    }

    // Clear user data and token from AsyncStorage
    await clearUserData();
    console.log('Logout successful. User data cleared.');
  } catch (error) {
    console.error('Error during logout:', error.message);
    throw new Error(error.message || 'Error during logout');
  }
};

// Fetch Salary Data for a Month
export const fetchSalaryData = async (month) => {
  const apiUrl = `${BASE_URL}/salary`;

  if (!month) {
    throw new Error('Month parameter is required to fetch salary data');
  }

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${apiUrl}?month=${month}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Error fetching salary data: ${errorResponse}`);
    }

    const data = await response.json();
    console.log('Salary Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching salary data:', error.message);
    throw new Error(error.message || 'Error fetching salary data');
  }
};
