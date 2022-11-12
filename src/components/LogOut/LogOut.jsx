import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { PNPBackend } from '../../utils/utils';
import { logout, useNavigate } from '../../utils/auth_utils';
import { Cookies, withCookies } from '../../utils/cookie_utils';

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSubmit2 = async () => {
    await PNPBackend.get('/test/');
  };

  return (
    <div>
      <h2>Logout</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit" onClick={handleSubmit}>
        Logout
      </button>
      <button type="submit" onClick={handleSubmit2}>
        Click me
      </button>
    </div>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Logout);
