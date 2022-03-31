import axios from "axios";
import { useStore } from "../store";

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      const { setGlobalAlert } = useStore.getState();
      setGlobalAlert("error", "You must be logged in to perform this action!");
    }
    return Promise.reject(error);
  }
);


const routes = {
  pattern: `${process.env.REACT_APP_API_HOST}/api/pattern`,
  login: `${process.env.REACT_APP_API_HOST}/auth/login`,
  logout: `${process.env.REACT_APP_API_HOST}/auth/logout`,
};

// Don't export axios lol
export { routes };
