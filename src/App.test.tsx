import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the API Sentinel auth page', () => {
  render(<App />);
  expect(screen.getByText('API Sentinel')).toBeInTheDocument();
});
