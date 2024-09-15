import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import axios from '../../api/axiosConfig';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';


function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  
  // Sign In states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register states
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [validationCode, setValidationCode] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, password });
      console.log('Signing in', response.data);
    } catch (error) {
      console.error('Login failed:', error.response?.data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setEmailError('');
    try {
      const response = await axios.post('/register', { 
        username: registerUsername, 
        email: registerEmail, 
        password: registerPassword, 
        validationCode 
      });
      console.log('Registering', response.data);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (error.response.data.field === 'username') {
          setUsernameError('Username already taken');
        } else if (error.response.data.field === 'email') {
          setEmailError('Email already registered');
        }
      }
      console.error('Registration failed:', error.response?.data);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Logging in with Google');
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setRegisterEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const handleSendCode = async () => {
    if (registerEmail && isEmailValid && countdown === 0) {
      try {
        await axios.post('/send-verification', { email: registerEmail });
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount === 1) {
              clearInterval(timer);
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to send verification code:', error);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignIn ? 'Sign In' : 'Register'}</h2>
        <div className="toggle-buttons">
          <button
            className={isSignIn ? 'active' : ''}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={!isSignIn ? 'active' : ''}
            onClick={() => setIsSignIn(false)}
          >
            Register
          </button>
        </div>
        {isSignIn ? (
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            {usernameError && <span className="error-message">{usernameError}</span>}
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={handleEmailChange}
                className={isEmailValid ? '' : 'invalid-input'}
                required
              />
              {!isEmailValid && <span className="error-message-inline">Invalid email format</span>}
              {emailError && <span className="error-message">{emailError}</span>}
            </div>
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <div className="validation-code-container">
              <input
                type="text"
                placeholder="Validation Code"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Send Code'}
              </button>
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
        )}
        {isSignIn && (
        <>
          <div className="divider">OR</div>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              // 在这里处理登录成功后的逻辑
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            text="Google Account Login"
          />
        </>
      )}
      </div>
    </div>
  );
}

export default Login;
