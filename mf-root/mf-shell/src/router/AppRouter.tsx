import React from 'react';
import { useRoutes } from 'wouter';
import { routes } from './routes';

export function AppRouter() {
  // Using wouter's useRoutes for declarative routing
  const routeResult = useRoutes(routes);
  
  // Fallback if no routes match
  if (!routeResult) {
    return <div>Not Found</div>;
  }
  
  return routeResult;
}