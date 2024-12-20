// // For Records Data
// // src/api/api.ts
// export const fetchAttendanceData = async () => {
//   const apiUrl = 'https://at.realvictorygroups.xyz/api/attendance/day_wise';
//   const token = 'Bearer 1|Tw4EJlKlvdO6ZWgvguplEQVbq5AaLsEI3Dm4YuCGd77f26ad';

//   try {
//       const response = await fetch(apiUrl, {
//           method: 'GET',
//           headers: {
//               'Authorization': token,
//               'Content-Type': 'application/json',
//           },
//       });
//       const data = await response.json();
//       return data;  // Return the data
//   } catch (error) {
//       throw new Error('Error fetching attendance data: ' + error.message);
//   }
// };

// // For Login
// export const loginUser = async (email: string, password: string) => {
//     const apiUrl = 'https://at.realvictorygroups.xyz/api/login';
  
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Invalid email or password');
//       }
  
//       const data = await response.json();
//       if (!data.token) {
//         throw new Error('Login failed: No token received');
//       }
  
//       return data; // { token: string, user: object }
//     } catch (error: any) {
//       throw new Error(error.message || 'Error during login');
//     }
//   };
  

  ///////////////////////////////////////////////////////////////////////

  import AsyncStorage from '@react-native-async-storage/async-storage';

  // Function to login user and retrieve token
  export const loginUser = async (email: string, password: string) => {
    const apiUrl = 'https://at.realvictorygroups.xyz/api/login'; // Replace with your API endpoint
  
    try {
      // Fetch API request to login
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Log the response to check the server's response
      console.log('Response from login API:', response);
  
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Log the response data to check if the token exists
      console.log('Data from login API:', data);
  
      // Check if token is in the response
      if (!data.token) {
        throw new Error('Login failed: No token received');
      }
  
      // Log the token to check its value
      console.log('Received Token:', data.token);
  
      // Save user data and token to AsyncStorage
      await storeUserData(data.user, data.token);
  
      return data; // { token: string, user: object }
    } catch (error: any) {
      // Log any errors that occur during login
      console.error('Login error:', error.message);
      throw new Error(error.message || 'Error during login');
    }
  };
  
  // Function to store user data and token to AsyncStorage
  export const storeUserData = async (user: { name: string; email: string }, token: string) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      console.log('User data and token saved to AsyncStorage');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };
  
  // Function to retrieve user data from AsyncStorage
  export const getUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        return JSON.parse(storedUser);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  
  // Function to remove user data and token from AsyncStorage (used for logout)
  export const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('token');
      console.log('User data and token removed from AsyncStorage');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };
  
  // Function to retrieve auth token from AsyncStorage
  export const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };
  
  // Function to handle the check-in request
  export const checkIn = async (
    photoUri: string | null,
    location: { latitude: number; longitude: number } | null
  ) => {
    if (!photoUri || !location) {
      throw new Error('Photo and location are required for check-in');
    }
  
    // Fetch the user token from AsyncStorage
    const userData = await getUserData();
    const token = await AsyncStorage.getItem('token'); // Ensure you have token stored in AsyncStorage
    
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      type: 'image/png',
      name: 'file.png',
    } as any); // Type assertion to handle image as a file
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    formData.append('distance', '70m'); // Assuming static distance, adjust as needed
    formData.append('user_id', userData?.user?.id ?? ''); // User ID from AsyncStorage
  
    try {
      const response = await fetch('https://at.realvictorygroups.xyz/api/attendance/check_in', {
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
      return data; // Return response data if needed
    } catch (error: any) {
      console.error('Error during check-in:', error.message);
      throw new Error(error.message || 'Error during check-in');
    }
  };
  