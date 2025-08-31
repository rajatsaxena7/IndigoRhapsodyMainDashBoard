import React from 'react';
import styled from 'styled-components';
import { logout } from '../../service/apiUtils';

const LogoutButton = ({ children, ...props }) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <StyledButton onClick={handleLogout} {...props}>
      {children || 'Logout'}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
  }
`;

export default LogoutButton;
