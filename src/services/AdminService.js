import axios from "axios";

const API_URL = "http://localhost:8080/api/test/admin";

const getAll = () => {
  return axios.get(API_URL + "/all");
};

const remove = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const findByTitle = (title) => {
  return axios.get(`${API_URL}?title=${title}`);
};

const AdminService = {
  getAll,
  remove,
  findByTitle,
};

export default AdminService;
