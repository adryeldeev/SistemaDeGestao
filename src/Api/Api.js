import axios from 'axios'

export const urlApi = 'http://localhost:8000/';
//https://backendsistemasalao.onrender.com/
const Api = axios.create({
    baseURL:'http://localhost:8000/',
    //https://backendsistemasalao.onrender.com/
})


export default Api;