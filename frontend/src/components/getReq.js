
import axios from 'axios';
export const getReq = async (path) => {
  try {

    const response = await axios.get(`http://localhost:5005/${path}`);
    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      console.log(response.status);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getReq;