import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.withCredentials = true


export const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    axios.get(`/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            navigate('/login')
        }
    })

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout
