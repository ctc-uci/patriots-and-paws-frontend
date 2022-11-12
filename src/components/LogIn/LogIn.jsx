import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from '../../utils/cookie_utils';
import { logInWithEmailAndPassword, signInWithGoogle, useNavigate } from '../../utils/auth_utils';

const Login = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await logInWithEmailAndPassword(email, password, '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /**
   * This function handles logging in with Google
   * If the user logs in and is new, they are directed to a new-user path
   * If the user logs in and isn't new, they are directed to the dashboard.
   * If the user fails to log in, they are directed back to the login screen
   */
  const handleGoogleSignIn = async e => {
    try {
      e.preventDefault();
      await signInWithGoogle('/new-user', '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={({ target }) => setEmail(target.value)} placeholder="Email" />
        <br />
        <input
          type="password"
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Password"
        />
        <br />
        <button type="submit">Sign in</button>
      </form>
      <button type="submit" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
      <br />
      <a href="/forgotpassword">Forgot Password</a>
    </div>
  );
};

Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Login);
