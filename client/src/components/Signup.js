import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../styling/Auth.css'

const Signup = ({ user, setUser }) => {

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters '),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),      
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      passwordConfirmation: Yup.string()
        .required('Password Confirmation is required')
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: (values) => {
      fetch('/signup', {
        method: 'POST',
        headers:  {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      .then(async res => {
        if(res.ok) {
          return res.json()
        } else {
          const errorData = await res.json()
          console.error('Server error response:', errorData)
          throw new Error(errorData.error || `Registration failed with status ${res.status}`)
        }
      })
      .then(user => {
        setUser(user)
        navigate('/profile')
      })
      .catch(error => {
        console.error('Registration error:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
        alert(`Registration failed: ${error.message}`)
      })
    }
  })
  return (
    <div>
      <h1>Sign Up</h1>
    </div>
  )
}

export default Signup