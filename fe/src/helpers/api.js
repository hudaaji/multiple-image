import axios from 'axios'

export const axioz = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',
  baseURL: 'http://154.26.132.106:7002/api/',
  headers: {'X-Custom-Header': 'foobar'}
});