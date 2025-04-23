import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {sidebar && (
        <aside className="w-64 flex-shrink-0 border-r border-border">
          {sidebar}
        </aside>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        {header && (
          <header className="h-16 border-b border-border flex items-center px-4">
            {header}
          </header>
        )}

        {/* Content area with scrolling */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>

        {/* Footer */}
        {footer && (
          <footer className="h-12 border-t border-border flex items-center justify-center px-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default MainLayout;