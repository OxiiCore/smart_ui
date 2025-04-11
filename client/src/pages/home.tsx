import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { fetchFieldUsageStatistics } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { FormFieldStatistic, FieldUsageStatisticsResponse } from '@/lib/types';

// Định nghĩa màu sắc cho các loại field
const FIELD_TYPE_COLORS = {
  TEXT: '#00B1D2',
  PARAGRAPH: '#0088A9',
  NUMBER: '#00D27F',
  SINGLE_CHOICE: '#D2A800',
  MULTI_CHOICE: '#D26400',
  DATE: '#D20036',
  INPUT: '#7A00D2',
  CACHE: '#D200C2',
  AUDIO_RECORD: '#4D00D2',
  SCREEN_RECORD: '#008BD2',
  IMPORT: '#00D2B1',
  EXPORT: '#6AD200',
  QR_SCAN: '#D2B100',
  GPS: '#D27700',
  CHOOSE: '#D25D00',
  SELECT: '#D24B00',
  SEARCH: '#D23500',
  FILTER: '#D21E00',
  DASHBOARD: '#D20700',
  PHOTO: '#D200A3'
};

// Các màu bổ sung cho biểu đồ tròn
const PIE_COLORS = [
  '#00B1D2', '#0088A9', '#00D27F', '#D2A800', '#D26400',
  '#D20036', '#7A00D2', '#D200C2', '#4D00D2', '#008BD2'
];

export default function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldStats, setFieldStats] = useState<FormFieldStatistic[]>([]);
  const [formFieldCount, setFormFieldCount] = useState<number>(0);
  
  useEffect(() => {
    // Hàm tải dữ liệu thống kê về tần suất sử dụng field
    async function loadFieldStatistics() {
      try {
        setLoading(true);
        const response = await fetchFieldUsageStatistics();
        
        if (!response.data || !response.data.core_core_dynamic_form_fields) {
          throw new Error('Không thể lấy dữ liệu thống kê từ API');
        }
        
        const formFields = response.data.core_core_dynamic_form_fields;
        
        // Tính tổng số form field
        setFormFieldCount(formFields.length);
        
        // Tính số lượng từng loại field
        const fieldTypeCount: Record<string, number> = {};
        
        formFields.forEach((formField: any) => {
          if (formField.core_dynamic_field && formField.core_dynamic_field.field_type) {
            const fieldType = formField.core_dynamic_field.field_type;
            fieldTypeCount[fieldType] = (fieldTypeCount[fieldType] || 0) + 1;
          }
        });
        
        // Chuyển đổi thành mảng để hiển thị trong biểu đồ
        const fieldStatsData = Object.entries(fieldTypeCount).map(([fieldType, count]) => ({
          name: fieldType,
          value: count,
          percent: Math.round((count / formFields.length) * 100)
        }));
        
        // Sắp xếp theo số lượng từ cao đến thấp
        fieldStatsData.sort((a, b) => b.value - a.value);
        
        setFieldStats(fieldStatsData);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải thống kê:', err);
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải thống kê');
        setLoading(false);
      }
    }
    
    loadFieldStatistics();
  }, []);
  
  // Hàm chuyển đổi tên hiển thị cho các loại field
  const getFieldTypeDisplayName = (fieldType: string): string => {
    const displayNameMap: Record<string, string> = {
      'TEXT': 'Văn bản',
      'PARAGRAPH': 'Đoạn văn',
      'NUMBER': 'Số',
      'SINGLE_CHOICE': 'Lựa chọn đơn',
      'MULTI_CHOICE': 'Lựa chọn nhiều',
      'DATE': 'Ngày tháng',
      'INPUT': 'Nhập liệu',
      'CACHE': 'Bộ nhớ đệm',
      'AUDIO_RECORD': 'Ghi âm',
      'SCREEN_RECORD': 'Ghi màn hình',
      'IMPORT': 'Nhập dữ liệu',
      'EXPORT': 'Xuất dữ liệu',
      'QR_SCAN': 'Quét QR',
      'GPS': 'Vị trí GPS',
      'CHOOSE': 'Chọn',
      'SELECT': 'Chọn lựa',
      'SEARCH': 'Tìm kiếm',
      'FILTER': 'Lọc',
      'DASHBOARD': 'Bảng điều khiển',
      'PHOTO': 'Hình ảnh'
    };
    
    return displayNameMap[fieldType] || fieldType;
  };
  
  // Biến đổi dữ liệu để hiển thị tên thân thiện
  const displayFieldStats = fieldStats.map(stat => ({
    ...stat,
    displayName: getFieldTypeDisplayName(stat.name)
  }));

  return (
    <MainLayout title={t('app.title', 'Hệ thống Quản lý Form Động')}>
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('home.dashboard', 'Thống kê sử dụng Form Fields')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('home.dashboardDescription', 'Biểu đồ hiển thị tần suất sử dụng các loại trường dữ liệu trong hệ thống.')}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2 shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>{t('home.fieldTypeUsageChart', 'Biểu đồ tần suất sử dụng loại trường')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex flex-col gap-4 h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayFieldStats}
                    margin={{ top: 20, right: 10, left: 10, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="displayName" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} trường (${Math.round((value / formFieldCount) * 100)}%)`,
                        'Số lượng'
                      ]}
                      labelFormatter={(label) => `Loại: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Số lượng" 
                      fill="#00B1D2"
                      radius={[4, 4, 0, 0]}
                    >
                      {displayFieldStats.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={FIELD_TYPE_COLORS[entry.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>{t('home.fieldTypeDistributionChart', 'Phân bố loại trường')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex flex-col gap-4 h-full">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayFieldStats.slice(0, 10)} // Chỉ hiển thị 10 loại field phổ biến nhất
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="displayName"
                      label={({ displayName, percent }) => `${displayName}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {displayFieldStats.slice(0, 10).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${value} trường (${Math.round((value / formFieldCount) * 100)}%)`,
                        'Số lượng'
                      ]}
                      labelFormatter={(label) => `Loại: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>{t('home.fieldUsageStatistics', 'Thống kê chi tiết tần suất sử dụng field')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-muted">{t('home.fieldType', 'Loại trường')}</th>
                        <th className="text-left p-3 bg-muted">{t('home.count', 'Số lượng')}</th>
                        <th className="text-left p-3 bg-muted">{t('home.percentage', 'Phần trăm')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayFieldStats.map((stat, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                          <td className="p-3 font-medium">{stat.displayName}</td>
                          <td className="p-3">{stat.value}</td>
                          <td className="p-3">{stat.percent}%</td>
                        </tr>
                      ))}
                      <tr className="bg-muted font-bold">
                        <td className="p-3">{t('home.total', 'Tổng cộng')}</td>
                        <td className="p-3">{formFieldCount}</td>
                        <td className="p-3">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
