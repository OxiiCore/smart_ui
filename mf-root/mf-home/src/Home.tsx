import React from 'react';
import HomePage from './pages/home';

// Export HomePage as default and also as named export
export { HomePage };

// Default export for direct usage in Shell
export default function Home() {
  return <HomePage />;
}
