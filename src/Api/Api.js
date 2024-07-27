import axios from 'axios'

export const urlApi = 'https://backendsistemasalao.onrender.com/';

const Api = axios.create({
    baseURL:'https://backendsistemasalao.onrender.com/',
    
})


export default Api;