import React from 'react';
import { Route, Switch } from 'wouter';
import { routes } from './routes';

export const AppRouter: React.FC = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          component={route.component}
        />
      ))}
    </Switch>
  );
};