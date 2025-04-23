import React from 'react';
import FormPage from './pages/forms';

// Export FormPage as default and also as named export
export { FormPage };

// Default export for direct usage in Shell
export default function Form() {
  return <FormPage />;
}
