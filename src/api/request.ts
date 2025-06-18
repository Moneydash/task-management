import client from "./axiosInstance";

export const formRequest = async (method: string, url: string, payload: object) => {
  return client(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' , 'Accept': 'application/json' },
    data: payload,
  });
};