import axios from 'axios';

const API_URL = 'http://localhost:5080/'; // URL of Flask server

export default {
  async getPlateData(formData) {
    try {
      const response = await axios.post(`${API_URL}plate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('There was an error!', error);
    }
  },
};