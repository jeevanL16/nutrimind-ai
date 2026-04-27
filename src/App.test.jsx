import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    // Check if the logo/title exists
    expect(screen.getByText(/NutriMind/i)).toBeTruthy();
  });
});
