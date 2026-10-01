import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Dashboard', () => ({ Dashboard: () => <div>API Sentinel dashboard</div> }));

test('renders the dashboard without a sign-in page', () => {
  render(<App />);
  expect(screen.getByText('API Sentinel dashboard')).toBeInTheDocument();
});
