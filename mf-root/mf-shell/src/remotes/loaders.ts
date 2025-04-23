import React from 'react';

// Define type for remote component loader functions
type RemoteComponentLoader = () => Promise<React.ComponentType<any>>;

// Remote module loaders
export const loadHomeComponent: RemoteComponentLoader = async () => {
  // @ts-ignore - Dynamic import from Module Federation
  return await import('home/Home').then((module) => module.default);
};

export const loadSubmissionComponent: RemoteComponentLoader = async () => {
  // @ts-ignore - Dynamic import from Module Federation
  return await import('submission/Submission').then((module) => module.default);
};

export const loadFormComponent: RemoteComponentLoader = async () => {
  // @ts-ignore - Dynamic import from Module Federation
  return await import('form/Form').then((module) => module.default);
};

export const loadRecordComponent: RemoteComponentLoader = async () => {
  // @ts-ignore - Dynamic import from Module Federation
  return await import('record/Record').then((module) => module.default);
};

// Error boundary component for handling remote module loading errors
export const RemoteErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return React.createElement(
      'div',
      { className: 'p-4 border border-red-300 rounded bg-red-50 text-red-700' },
      fallback || React.createElement(
        'div',
        null,
        React.createElement('h3', { className: 'text-lg font-medium mb-2' }, 'Không thể tải module'),
        React.createElement('p', null, 'Đã xảy ra lỗi khi tải module. Vui lòng thử tải lại trang.'),
        React.createElement(
          'button',
          { 
            onClick: () => window.location.reload(),
            className: 'mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          },
          'Tải lại'
        )
      )
    );
  }

  return React.createElement(React.Fragment, null, children);
};