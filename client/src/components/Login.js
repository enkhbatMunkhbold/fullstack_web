import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../styling/Auth.css'

const Login = ({ setUser }) => {

  const navigate = useNavigate()
  const [ error, setError ] = useState(null)

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    }, 
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required")
    }),
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values)
      })
      .then(async res => {
        if(!res.ok) {
          return res.json().then(err => {
            throw new Error(err.message || "Invalid credentials")
          })
        }
        return res.json()
      })
      .then(user => {
        setUser(user)
        navigate('/login')
      })
      .catch(err => {
        setError(err.message || "Invalid credentials")
      })
    }
  })


  return (
    <div className='auth-container'>
      <form onSubmit={formik.handleSubmit} className='auth-form'>
        <h2>Login</h2>
        {error && <p className='error-message' style={{ color: 'red' }}>{error}</p>}
        <div className='form-group'>
          <input 
            type='text'
            name='username'
            placeholder='Username'
            autoComplete='off'
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username ? (
            <p classname='error-message' style={{ color: 'red' }}>{formik.errors.username}</p>
          ) : null}
        </div>
        <div className='form-group'>
          <input 
            type="password"
            name='password'
            placeholder='Password'
            autoComplete='current-password'
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className='error-message' style={{ color: 'red' }}>{formik.errors.password}</p>
          ) : null}
          <button type='submit'>Login</button>
          <div className='auth-link'>
            Don't have an account? <Link to={'/signup'}>Sign Up</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login