import axios from "axios";

const API_URL = "http://localhost:8080/api/test/movies";

const getAll = () => {
  return axios.get(API_URL);
};

const get = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const create = (data) => {
  return axios.post(API_URL, data);
};

const update = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

const remove = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};


const findByTitle = (title) => {
  return axios.get(`${API_URL}?title=${title}`);
};

const TutorialService = {
  getAll,
  get,
  create,
  update,
  remove,
  findByTitle,
};

export default TutorialService;
