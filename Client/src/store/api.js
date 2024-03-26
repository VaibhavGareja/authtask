import axios from "axios";

export function signup(userData) {
  return axios.post("http://localhost:3000/signup", userData);
}

export function login(userData) {
  return axios.post("http://localhost:3000/login", userData);
}
