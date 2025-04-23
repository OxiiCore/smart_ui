import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Submission from './Submission';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

// Mount function for standalone mode
const mount = () => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Submission />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// If we are in development and in isolation,
// call mount immediately
const devRoot = document.getElementById('root');
if (devRoot) {
  mount();
}

export { Submission };