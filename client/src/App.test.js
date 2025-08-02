import { render, screen } from '@testing-library/react';
import App from './App';

test('renders library management system', () => {
  render(<App />);
  const titleElement = screen.getByText(/Library Management System/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders sign in form', () => {
  render(<App />);
  const emailLabel = screen.getByText(/Email Address/i);
  const passwordLabel = screen.getByText(/Password/i);
  const signInButtons = screen.getAllByText(/Sign In/i);
  
  expect(emailLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(signInButtons.length).toBeGreaterThan(0);
});
