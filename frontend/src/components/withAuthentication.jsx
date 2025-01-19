import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const withAuthentication = (Component) => {
  return (props) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    if (!isAuthenticated) {
      loginWithRedirect();
      return null; 
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
