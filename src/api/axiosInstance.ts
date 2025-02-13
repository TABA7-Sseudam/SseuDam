import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",  // Vite proxy 설정 덕분에 자동으로 http://localhost:8080/api로 변환됨
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;