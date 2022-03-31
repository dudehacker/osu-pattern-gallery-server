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

var apiHost = process.env.REACT_APP_API_HOST;

if (process.env.NODE_ENV === "production") {
  apiHost = process.env.REACT_APP_API_HOST_PROD;
}

const routes = {
  pattern: `${apiHost}/api/pattern`,
  login: `${apiHost}/auth/login`,
  logout: `${apiHost}/auth/logout`,
};

// Don't export axios lol
export { routes };
