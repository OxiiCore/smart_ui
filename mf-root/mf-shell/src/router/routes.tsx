import React, { lazy, Suspense } from 'react';
import { 
  loadHomeComponent, 
  loadSubmissionComponent, 
  loadFormComponent, 
  loadRecordComponent, 
  RemoteErrorBoundary 
} from '../remotes/loaders';

// Define loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Create lazy-loaded components for each route
const HomePage = lazy(() => loadHomeComponent().then(Component => ({ default: Component })));
const SubmissionPage = lazy(() => loadSubmissionComponent().then(Component => ({ default: Component })));
const FormPage = lazy(() => loadFormComponent().then(Component => ({ default: Component })));
const RecordPage = lazy(() => loadRecordComponent().then(Component => ({ default: Component })));

// Define route configuration
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => (
      <RemoteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <HomePage />
        </Suspense>
      </RemoteErrorBoundary>
    ),
  },
  {
    path: '/submissions',
    component: () => (
      <RemoteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <SubmissionPage />
        </Suspense>
      </RemoteErrorBoundary>
    ),
  },
  {
    path: '/form/:formId',
    component: () => (
      <RemoteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <FormPage />
        </Suspense>
      </RemoteErrorBoundary>
    ),
  },
  {
    path: '/record-detail/:recordId',
    component: () => (
      <RemoteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <RecordPage />
        </Suspense>
      </RemoteErrorBoundary>
    ),
  },
];