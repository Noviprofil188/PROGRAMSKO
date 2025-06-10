import axios from "axios";

// Postavljanje globalne konfiguracije za axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
  timeout: 5000, // Opcionalno, vrijeme čekanja na odgovor
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
