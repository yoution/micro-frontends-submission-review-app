import axios from "axios";
import { getAuthUserTokens } from "@topcoder/micro-frontends-navbar-app";

export const getToken = () => {
  return new Promise(async (resolve, reject) => {
    return getAuthUserTokens().then(({tokenV3}) => {
      return resolve(tokenV3);
    }).catch(err =>{
      console.log(err);
      reject(err);
    })
  })
};

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor to pass auth token
axiosInstance.interceptors.request.use((config) => {
  return getToken()
    .then((token) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    })
    .catch((err) => {
      // TODO handle this error somehow
      console.log(err);
      return config;
    });
});
