interface APIConfig {
  baseURL: string;
  apiKey?: string;
}

export const API_CONFIG: APIConfig = {
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://your-render-app.onrender.com/api'  // You'll update this with your Render URL
    : 'http://localhost:4000/api',
  apiKey: import.meta.env.VITE_API_KEY
};
