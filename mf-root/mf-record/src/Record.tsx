import React from 'react';
import RecordDetailPage from './pages/record-detail';

// Export RecordDetailPage as default and also as named export
export { RecordDetailPage };

// Default export for direct usage in Shell
export default function Record() {
  return <RecordDetailPage />;
}
