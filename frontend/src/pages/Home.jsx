import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/NavBar";
import DefinitionBox from "../components/home/DefinitionBox";
import SloganText from "../components/home/SloganText";
import { createUser } from "../services/userService";  

const Home = () => {
  const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const navigate = useNavigate();

  const handleNavigate = () => {
    // navigate("/upload");
    navigate("/study-sets");
  };

  const handleLogin = async () => {
    if (user) {
      try {
        const token = await getAccessTokenSilently();
        const userInfo = {
          sub: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
          updated_at: user.updated_at,
        };
        await createUser(userInfo, token);  
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      handleLogin();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="overlay">
      <Nav />
      <div className="homepage">
        <DefinitionBox />
        <SloganText
          isAuthenticated={isAuthenticated}
          user={user}
          loginWithRedirect={loginWithRedirect}
          handleNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default Home;
