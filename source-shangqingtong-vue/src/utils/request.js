import axios from "axios"

const baseUrl = 'http://120.76.247.5:2003'
const instance = axios.create({
    baseURL: baseUrl + "/api"
})

instance.baseUrl = baseUrl

export default instance