import React from 'react';
import { useRoute } from 'wouter';
import FormsPage from './forms';

export default function StandaloneFormPage() {
  // Lấy id của form từ URL
  const [_, params] = useRoute<{ id: string }>('/form/:id');
  const formId = params?.id;

  if (!formId) {
    return <div className="p-5 text-center text-red-500">Không tìm thấy ID form</div>;
  }

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }} className="bg-background">
      {/* Có thể bạn cần truyền formId vào FormsPage nếu component FormsPage của bạn hỗ trợ việc này */}
      <FormsPage standaloneMode={true} initialFormId={formId} />
    </div>
  );
}