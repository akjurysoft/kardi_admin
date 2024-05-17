import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4040/",
  //baseURL: 'http://3.91.105.55:4040/',
  headers: {
    post: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    get: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  withCredentials: false,
});

export default instance;
