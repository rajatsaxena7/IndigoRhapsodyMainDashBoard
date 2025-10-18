import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Cookies from "js-cookie";
import { apiCall } from "../../service/apiUtils";
import { API_BASE_URL } from "../../config/environment";

async function loginUser(email, password) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/admin-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Something went wrong.");
  }
}

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    const userId = Cookies.get("userId");
    if (token && userId) {
      window.location.href = "/dashboard";
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      
      // Store token and user data in secure cookies
      const cookieOptions = {
        expires: 7, // 7 days
        sameSite: 'lax' // More permissive for development
      };
      
      // Only use secure flag in production
      if (window.location.protocol === 'https:') {
        cookieOptions.secure = true;
      }
      
      Cookies.set("authToken", data.accessToken, cookieOptions);
      Cookies.set("userId", data.user._id, cookieOptions);
      Cookies.set("userRole", data.user.role, cookieOptions);
      Cookies.set("userEmail", data.user.email, cookieOptions);
      
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        {/* Left Panel - Login Form */}
        <LeftPanel>
          <LogoSection>
            <LogoIcon>
              <LogoText>IR</LogoText>
            </LogoIcon>
            <BrandName>Indigo Rhapsody</BrandName>
          </LogoSection>
          
          <LoginContent>
            <FormContainer>
              <Title>Welcome back</Title>
              
                             <form onSubmit={handleLogin}>
                 <InputGroup>
                   <Input
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                   />
                 </InputGroup>
                 
                 <InputGroup>
                   <Input
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                   />
                 </InputGroup>
                 
                 <LoginButton type="submit" disabled={loading}>
                   {loading ? "Signing in..." : "Continue"}
                 </LoginButton>
               </form>
              
             
            </FormContainer>
          </LoginContent>
        </LeftPanel>
        
                 {/* Right Panel - Fashion GIF */}
         <RightPanel>
           <FashionGif>
                           <GifImage 
src="https://i.pinimg.com/736x/b2/25/5a/b2255aaf3c19f64c3d7daf08656704df.jpg"
alt="Fashion Design"
              />
           </FashionGif>
         </RightPanel>
      </LoginCard>
      <ToastContainer />
    </LoginContainer>
  );
}

export default Loginscreen;

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
`;

const LoginCard = styled.div`
  display: flex;
  background: white;
  width: 100%;
  height: 100vh;
`;

const LeftPanel = styled.div`
  background: white;
  padding: 40px;
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: white;
`;

const BrandName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: 'Georgia', serif;
`;

const LoginContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
  text-align: center;
`;



const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  background: white;
  color: #1a1a1a;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #6b7280;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const LegalText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
`;

const LegalLink = styled.a`
  color: #667eea;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
`;

const SignupText = styled.span`
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RightPanel = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const FashionGif = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const GifImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
