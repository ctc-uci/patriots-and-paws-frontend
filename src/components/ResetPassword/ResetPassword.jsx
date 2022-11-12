import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { confirmNewPassword } from '../../utils/auth_utils';

const ResetPassword = ({ code }) => {
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();
  const handleResetPassword = async e => {
    try {
      e.preventDefault();
      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }
      await confirmNewPassword(code, password);
      setConfirmationMessage('Password changed. You can now sign in with your new password.');
      setErrorMessage('');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <div>
      <h2>Reset Password</h2>
      {errorMessage && <p>{errorMessage}</p>}
      {!confirmationMessage && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            onChange={({ target }) => setPassword(target.value)}
            placeholder="New Password"
          />
          <br />
          <input
            type="password"
            onChange={({ target }) => setCheckPassword(target.value)}
            placeholder="Re-enter Password"
          />
          <br />
          <button type="submit">Reset Password</button>
        </form>
      )}
      {confirmationMessage && (
        <div>
          <p>{confirmationMessage}</p>
          <a href="/">Back to Login</a>
        </div>
      )}
    </div>
  );
};

ResetPassword.propTypes = {
  code: PropTypes.string.isRequired,
};

export default ResetPassword;
