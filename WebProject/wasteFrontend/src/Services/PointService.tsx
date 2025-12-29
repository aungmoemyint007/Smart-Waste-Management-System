import axios from "axios";
import { useSelector } from "react-redux";
const base_url = 'http://localhost:8000/api/'

const getPoints = async () => {
    const jwt = localStorage.getItem('token');
    return axios.get(`${base_url}get-user-points`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
        .then(res => res.data)
        .catch(error => {throw error})
}



export { getPoints};