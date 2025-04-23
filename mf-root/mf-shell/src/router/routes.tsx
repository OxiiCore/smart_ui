import React, { lazy, Suspense } from 'react';
import { loadPage } from '../remotes/loaders';

// Lazy-loaded components with suspense
const LazyHome = lazy(() => loadPage('home', 'HomePage'));
const LazySubmission = lazy(() => loadPage('submission', 'SubmissionPage'));
const LazyForm = lazy(() => loadPage('form', 'FormPage'));
const LazyRecordDetail = lazy(() => loadPage('record', 'RecordDetailPage'));

// Route configuration
export const routes = [
  {
    path: '/',
    component: () => (
      <Suspense fallback={<div>Loading Home...</div>}>
        <LazyHome />
      </Suspense>
    ),
  },
  {
    path: '/submission/:workflowId',
    component: ({ params }: { params: { workflowId: string } }) => (
      <Suspense fallback={<div>Loading Submission...</div>}>
        <LazySubmission workflowId={params.workflowId} />
      </Suspense>
    ),
  },
  {
    path: '/forms',
    component: () => (
      <Suspense fallback={<div>Loading Forms...</div>}>
        <LazyForm />
      </Suspense>
    ),
  },
  {
    path: '/record/:id',
    component: ({ params }: { params: { id: string } }) => (
      <Suspense fallback={<div>Loading Record Details...</div>}>
        <LazyRecordDetail recordId={params.id} />
      </Suspense>
    ),
  },
];