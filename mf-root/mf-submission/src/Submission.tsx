import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Component imports will eventually come from shared MF
const SubmissionDataTable = () => {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string | null>(null);

  // Get the submenu ID from the URL or from props
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get('menuId') || selectedSubmenuId;

  // Detect screen size for responsive view
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'card' : 'table');
      console.log("Current screen size:", isMobile ? "mobile" : "desktop");
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch submissions data
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['/api/submissions', menuId],
    queryFn: async () => {
      if (!menuId) return [];
      console.log("Executing GraphQL query with variables:", { menuId, limit: 100, offset: 0 });
      
      // This would be replaced with actual API call in the real implementation
      const response = await fetch('/api/submissions?menuId=' + menuId);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!menuId,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-4 p-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <div>Đã xảy ra lỗi khi tải dữ liệu.</div>
        <div className="mt-2 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    );
  }

  // Render empty state if no data
  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-2xl mb-2">📋</div>
        <div className="text-gray-500">Không có dữ liệu nào được tìm thấy.</div>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          onClick={() => {
            // This would navigate to the form creation page in the actual implementation
            console.log("Navigate to form creation page");
          }}
        >
          Tạo mới
        </button>
      </div>
    );
  }

  // Table View (for desktop)
  if (viewMode === 'table') {
    return (
      <div className="p-4">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Mã
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Tiêu đề
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Người tạo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.code || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.status?.name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.created_by_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setLocation(`/record-detail/${item.id}`)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      👁️
                    </button>
                    {/* Add other action buttons as needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Card View (for mobile)
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4">
        {submissions.map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{item.title || '-'}</div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {item.status?.name || '-'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-medium">Mã:</span> {item.code || '-'}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-medium">Người tạo:</span> {item.created_by_name || '-'}
            </div>
            <div className="text-sm text-gray-500 mb-3">
              <span className="font-medium">Ngày tạo:</span> {new Date(item.created_at).toLocaleDateString('vi-VN')}
            </div>
            <div className="flex justify-end mt-2 border-t pt-2">
              <button
                onClick={() => setLocation(`/record-detail/${item.id}`)}
                className="text-primary hover:text-primary/80 mr-3"
              >
                👁️ Xem
              </button>
              {/* Add other action buttons as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Submission: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 p-4">Quản lý hồ sơ</h1>
      <SubmissionDataTable />
    </div>
  );
};

export default Submission;