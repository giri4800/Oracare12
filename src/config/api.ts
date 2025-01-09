export const API_CONFIG = {
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://your-render-app.onrender.com/api'  // You'll update this with your Render URL
    : 'http://localhost:4000/api'
};
