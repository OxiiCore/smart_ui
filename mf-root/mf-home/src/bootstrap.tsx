import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
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
        <Home />
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

export { Home };