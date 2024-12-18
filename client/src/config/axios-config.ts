import axios from "axios";

const httpClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export { httpClient };
