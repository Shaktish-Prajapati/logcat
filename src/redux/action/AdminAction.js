import axios from 'axios';
import cookie from 'react-cookies';
import { useHistory } from 'react-router';
import { 
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT,
    ADMIN_LOGOUT_FAIL,
    
    ADMIN_REGISTER_REQUEST,
    ADMIN_REGISTER_SUCCESS,
    ADMIN_REGISTER_FAIL,

    FORGET_PASSWORD_REQUEST,
    FORGET_PASSWORD_REQUEST_SUCCESS,
    FORGET_PASSWORD_REQUEST_FAIL,
    FORGET_PASSWORD_RESET_STATE,

    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST_SUCCESS,
    RESET_PASSWORD_REQUEST_FAIL,

    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_REQUEST_SUCCESS,
    UPDATE_PROFILE_REQUEST_FAIL,
} from '../types/AdminConstants'



import { persistor } from '../Store';
// const dotenv = require('dotenv')

// dotenv.config()


export const loginWithEmail = (email, password, isRemeberMe) => async (dispatch)=>{
    try {
        dispatch({type:ADMIN_LOGIN_REQUEST});
        const config = {
            header: {
                "Content-type": "application/json"
            },
        }

        // const {data} = await axios.post('https://agvalogger.herokuapp.com/api/logger/login',{
        //     email,
        //     password
        // },
        // config
        // )
        // https://logger-server.herokuapp.com

        const {data} = await axios.post(`https://logger-server.herokuapp.com/api/logger/login`,{
            email,
            password
        },
        config
        )
        dispatch({
            type: ADMIN_LOGIN_SUCCESS, 
            payload:data
        })

        // isRemeberMe ? localStorage.setItem("adminInfo", JSON.stringify(data)):''
        // data
        if (isRemeberMe) {
            localStorage.setItem("adminUserName", JSON.stringify(email))
            localStorage.setItem("userIsRemember",JSON.stringify(isRemeberMe))
            localStorage.setItem("adminUserCredential", JSON.stringify(password))
        }
        if (!isRemeberMe) {
            localStorage.removeItem("adminUserName")
            localStorage.removeItem("adminUserCredential")
            localStorage.removeItem("userIsRemember")
        }
        localStorage.setItem("ddAdminToken", data.data.token)
        // cookie.save('token',data.data.token)

    } catch (error) {
        dispatch({
            type: ADMIN_LOGIN_FAIL,
            payload:
            error.response && error.response.data.data 
            ? error.response.data.data.err.msg : error.message,
        })
    }
}

export const adminLogout = (history) => async (dispatch)=>{
    try {
        
        // localStorage.removeItem('adminInfo');
        const config = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('ddAdminToken')}`
            },
        }
        
        // const {data} = await axios.post('https://agvalogger.herokuapp.com/api/logger/logout',
        // config
        // )

        await axios.get(`https://logger-server.herokuapp.com/api/logger/logout`,
        config
        )
        
        
        localStorage.removeItem('ddAdminToken')
        await persistor.purge()
        
        history.push('/')
        dispatch({
            type:ADMIN_LOGOUT
        })

    } catch (error) {
        dispatch({
            type: ADMIN_LOGOUT_FAIL,
            payload:
            error.response && error.response.data.message 
            ? error.response.data.message : error.message,
        })
    }
}


// ****************** ADMIN REGISTER ACTIONS *************************
export const adminRegister = (email,password,name,history) => async (dispatch)=>{
    
    try {
        dispatch({
            type: ADMIN_REGISTER_REQUEST
        })

        const config = {
            header: {
                "Content-type": "application/json"
            },
        }
        // https://insulink-backend.herokuapp.com
        const {data} = await axios.post('https://logger-server.herokuapp.com/api/logger/register',{
            name,
            email,
            password,
        },
        config)

        dispatch({
            type: ADMIN_REGISTER_SUCCESS, 
            payload:data
        })

        localStorage.setItem("adminInfo", data)
        // cookie.save('token',data.user.token)
        history.push('/')


    } catch (error) {
        dispatch({
            type: ADMIN_REGISTER_FAIL,
            payload:
            error.response && error.response.data.errorMessage 
            ? error.response.data.errorMessage : error.message,
        })
    }
}

export const forgetPassword = (email) => async (dispatch)=>{
    
    try {
        dispatch({
            type: FORGET_PASSWORD_REQUEST
        })

        const config = {
            header: {
                "Content-type": "application/json"
            },
        }
        // https://insulink-backend.herokuapp.com
        // https://logger-server.herokuapp.com
        const {data} = await axios.post('http://localhost:5000/api/logger/forget',{
            email,
        })

        dispatch({
            type: FORGET_PASSWORD_REQUEST_SUCCESS, 
            payload:data
        })

        // localStorage.setItem("adminInfo", data)
        // cookie.save('token',data.user.token)
        // history.push('/')


    } catch (error) {
        dispatch({
            type: FORGET_PASSWORD_REQUEST_FAIL,
            payload:
            error.response && error.response.data.errorMessage 
            ? error.response.data.errorMessage : error.message,
        })
    }
}

export const resetForgetPasswordState = () => async (dispatch)=>{
    
    try {
        dispatch({
            type: FORGET_PASSWORD_RESET_STATE
        })

    } catch (error) {
        dispatch({
            type: FORGET_PASSWORD_REQUEST_FAIL,
            payload:
            error.response && error.response.data.errorMessage 
            ? error.response.data.errorMessage : error.message,
        })
    }
}

export const resetForgetPassword = ({email,resetData}) => async (dispatch)=>{
    
    try {
        dispatch({
            type: RESET_PASSWORD_REQUEST
        })

        const config = {
            header: {
                "Content-type": "application/json"
            },
        }
        const otp=resetData.otp;
        const password= resetData.newPass;
        const passwordVerify = resetData.confirmPass;


        // https://insulink-backend.herokuapp.com
        // https://logger-server.herokuapp.com
        
        const {data} = await axios.post('http://localhost:5000/api/logger/resetPassword',{
            otp,
            password,
            email,
            passwordVerify
        })

        dispatch({
            type: RESET_PASSWORD_REQUEST_SUCCESS, 
            payload:data
        })

        // localStorage.setItem("adminInfo", data)
        // cookie.save('token',data.user.token)
        // history.push('/')


    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_REQUEST_FAIL,
            payload:
            error.response && error.response.data && error.response.data.errorMessage
            ? error.response.data.errorMessage : error.message,
        })
    }
}

export const updateProfile = (email,name,avatar)=>async(dispatch)=>{
    try {
      console.log("form data: ",email, name, avatar);
      let formData = new FormData();
      formData.append('name',name)
    formData.append('image',avatar)
    console.log([...formData])
      dispatch({
        type: UPDATE_PROFILE_REQUEST,
      });
      const token = localStorage.getItem("ddAdminToken");
      // console.log(token);
      const config = {
        headers: {
          "Accept":"application/JSON",
          "Content-type": "multipart/form-data",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjI0MTU0MDM5ZDQxZjZhYTY3YzBjZDkzIiwianRpIjoiTWZheXpKd29WViIsImlhdCI6MTY0ODQ2NjkxOCwiZXhwIjoxNjQ5NzYyOTE4fQ.oDa9BefMV0qzIjVgGI9hpHn4dPTHukrZlmCcANxrjIc`,
        },
      };
    //   const body = {
    //     name,
    //     // email,
    //     formData
    //   }
    
      const { data } = await axios.put(
        `http://localhost:5000/api/logger/update`,formData,
        config,
      );
      // console.log(data);
      dispatch({
        type: UPDATE_PROFILE_REQUEST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_REQUEST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }