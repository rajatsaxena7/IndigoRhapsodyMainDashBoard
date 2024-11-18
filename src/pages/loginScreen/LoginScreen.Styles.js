import styled from "styled-components";
const LoginScreenWrap = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
`;

const LeftSection = styled.div`
  background-color: #ffffff;
  padding: 40px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const RightSection = styled.div`
  background-color: #7a5fff;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  width: 400px;
  text-align: center;
`;

const FormContainer = styled.div`
  h1 {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #6c757d;
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

  .separator {
    margin: 20px 0;
    text-align: center;
    color: #6c757d;
  }

  .signup-link {
    color: #7a5fff;
    text-align: center;
  }
`;

const InfoContainer = styled.div`
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
