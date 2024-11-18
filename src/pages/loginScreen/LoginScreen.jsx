import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

// Hardcoded credentials
const ADMIN_EMAIL = "adminlocal23test@gmail.com";
const ADMIN_PASSWORD = "admin123";

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the entered email and password match the hardcoded credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("userId", "admin");
      localStorage.setItem("isLoggedIn", "true"); // Set isLoggedIn to true

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <LoginScreenWrap>
      <LeftSection>
        <FormContainer>
          <h1>Welcome Back!</h1>
          <p>
            Ofative empowers you to manage, enhance, and safeguard your day,
            putting you in control of your schedule.
          </p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>
        </FormContainer>
      </LeftSection>
      <RightSection>
        <InfoContainer>
          <h2>Redefine Your Calendar Experience!</h2>
          <p>
            Unshackle yourself from the confines of traditional scheduling and
            immerse yourself in the boundless convenience that Ofative brings to
            your daily routine.
          </p>
        </InfoContainer>
      </RightSection>
      <ToastContainer />
    </LoginScreenWrap>
  );
}

export default Loginscreen;

// Styled Components
const LoginScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
`;

const LeftSection = styled.div`
  background-color: #ffffff;
  padding: 40px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const RightSection = styled.div`
  background-color: #7a5fff;
  padding: 40px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 300px;

  h1 {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }

  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #6c757d;
    text-align: center;
  }

  .form-group {
    margin-bottom: 15px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ced4da;
    border-radius: 5px;
  }

  .login-btn {
    width: 100%;
    padding: 10px;
    background-color: #7a5fff;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const InfoContainer = styled.div`
  max-width: 300px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #e6e6e6;
  }
`;
