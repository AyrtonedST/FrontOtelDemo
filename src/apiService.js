import axios from 'axios';

export const sendRequest = async () => {
  try {
    const res = await axios.get('https://tu-apigee-endpoint.com/api/test', {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Client': 'ReactFrontend',
        // Puedes agregar traceparent aquí si lo deseas más adelante
      }
    });
    return JSON.stringify(res.data, null, 2);
  } catch (error) {
    return `Error: ${error.message}`;
  }
};
