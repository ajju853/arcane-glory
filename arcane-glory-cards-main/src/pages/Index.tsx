
import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple redirect component to send users from the root path to home
const Index: React.FC = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
