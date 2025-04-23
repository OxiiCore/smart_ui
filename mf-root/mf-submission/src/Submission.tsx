import React from 'react';
import SubmissionPage from './pages/submission';

// Export SubmissionPage as default and also as named export
export { SubmissionPage };

// Default export for direct usage in Shell
export default function Submission() {
  return <SubmissionPage />;
}
