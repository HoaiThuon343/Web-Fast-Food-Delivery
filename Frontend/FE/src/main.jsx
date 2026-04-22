import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./main.scss";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { persistor, store } from "./redux/store.js"; // Giữ lại dòng này
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
// DÒNG import { store } từ './redux/store'; ĐÃ BỊ XÓA (trùng lặp)

// =======================================================
// BƯỚC 1: CẤU HÌNH AXIOS INTERCEPTOR (ĐẶT BÊN NGOÀI HÀM RENDER)
axios.interceptors.request.use(config => {
    // Lấy token từ Redux Store đã được lưu sau khi Login
    // Dùng store.getState() để truy cập trạng thái hiện tại
    const token = store.getState().account.token; 
    
    // Nếu có token và request KHÔNG phải là API công khai (như Login, Register)
    // Tên slice của bạn là 'account', nên ta dùng store.getState().account
    if (token && !config.url.includes('/Auth/login') && !config.url.includes('/Auth/register')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// =======================================================


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer />
      <App />
    </PersistGate>
  </Provider>
);