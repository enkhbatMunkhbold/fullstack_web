import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './NavBar';
import Home from './Home';
import Profile from './Profile';
import Login from './Login';
import Signup from './Signup';
import '../styling/App.css';

function App() {

  const [ user, setUser ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    fetch('/check_session', {
      credentials: 'include'
    }).then(r => {
      if(r.ok) {
        return r.json().then(user => {
          setUser(user)
          setIsLoading(false)
        })
      } else if(r.status === 401 || r.status === 204) {
        setUser(null)
        setIsLoading(false)
      } else {
        throw new Error(`HTTP error! Status ${r.status}`)
      }
    })
    .catch(error => {
      console.error('Error checking session:', error)
      setUser(null)
      isLoading(false)
    })
  }, [isLoading])

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <Router>
        <NavBar user={user} setUser={setUser} />
        <div>
          <Routes>
            { user ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login setUser={setUser}/>} />
                <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
