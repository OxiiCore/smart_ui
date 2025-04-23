import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from './providers/ThemeProvider';
import { I18nProvider } from './providers/I18nProvider';
import { MainSidebar } from './components/MainSidebar';
import { AppRouter } from './router/AppRouter';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <MainSidebar>
              <AppRouter />
            </MainSidebar>
          </div>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}