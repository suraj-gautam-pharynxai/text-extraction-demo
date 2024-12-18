import axios from 'axios';

export const logoutService = async (email: string, token: string): Promise<{ success: boolean; message: string }> => {
  console.log("LoginService:  ",email,token )
  try {
    const response = await axios.get(`${import.meta.env.VITE_TEST_AHTH_API}/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      // Remove token and email from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('email');

      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: 'Failed to log out' };
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, message: 'Error logging out. Please try again.' };
  }
};
