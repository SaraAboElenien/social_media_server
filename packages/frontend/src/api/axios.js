import axios from "axios";

const baseURL = import.meta.env.DEV 
  ? '' // Use Vite proxy in development
  : '/api' // Use relative path for same-domain deployment

const api = axios.create({ baseURL });

export default api;

