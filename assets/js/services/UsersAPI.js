import axios from "axios";
import { USERS_API } from "../config";


function register(user) {
    console.log(" register page in usersAPI" , user);

    return axios.post(USERS_API, user );
}


export default {
    register
}