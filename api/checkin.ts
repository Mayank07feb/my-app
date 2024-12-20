import AsyncStorage from '@react-native-async-storage/async-storage';

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