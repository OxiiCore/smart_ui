import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const { isMobile } = useIsMobile();
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
                    data={displayFieldStats.slice(0, isMobile ? 5 : displayFieldStats.length)}
                    margin={{ top: 20, right: 10, left: 10, bottom: isMobile ? 40 : 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="displayName" 
                      angle={isMobile ? -30 : -45} 
                      textAnchor="end"
                      height={isMobile ? 50 : 70}
                      interval={0}
                      fontSize={isMobile ? 10 : 12}
                      tickFormatter={(value) => isMobile && value.length > 10 ? value.substring(0, 10) + '...' : value}
                    />
                    <YAxis 
                      width={isMobile ? 30 : 40}
                      tickFormatter={(value) => isMobile && value > 999 ? `${(value/1000).toFixed(1)}K` : value.toString()}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} trường (${Math.round((value / formFieldCount) * 100)}%)`,
                        'Số lượng'
                      ]}
                      labelFormatter={(label) => `Loại: ${label}`}
                    />
                    <Legend 
                      verticalAlign={isMobile ? "top" : "bottom"}
                      height={isMobile ? 30 : 36}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Số lượng" 
                      fill="#00B1D2"
                      radius={[4, 4, 0, 0]}
                    >
                      {displayFieldStats.slice(0, isMobile ? 5 : displayFieldStats.length).map((entry, index) => (
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
            <CardContent className={isMobile ? "h-auto pb-6" : "h-[400px]"}>
              {loading ? (
                <div className="flex flex-col gap-4 h-full min-h-[250px]">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full min-h-[250px]">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Điều chỉnh ResponsiveContainer height để có không gian cho Legend */}
                  <div className={isMobile ? "h-[200px] w-full mx-auto" : "h-[75%] w-full"}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={displayFieldStats.slice(0, isMobile ? 5 : 8)} 
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={isMobile ? 60 : 90}
                          innerRadius={isMobile ? 25 : 40}
                          paddingAngle={3}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="displayName"
                          label={({ percent }) => `${percent.toFixed(0)}%`}
                        >
                          {displayFieldStats.slice(0, isMobile ? 5 : 8).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [
                            `${value} trường (${Math.round((value / formFieldCount) * 100)}%)`,
                            'Số lượng'
                          ]}
                          labelFormatter={(label) => `${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Tùy chỉnh Legend riêng với cách hiển thị khác nhau cho mobile và desktop */}
                  {isMobile ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-y-2">
                      {displayFieldStats.slice(0, 5).map((stat, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs mx-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="whitespace-nowrap">{stat.displayName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 px-4 mt-2">
                      {displayFieldStats.slice(0, 8).map((stat, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="truncate">{stat.displayName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="col-span-full"> 
                      {isMobile ? (
                        // Hiển thị dạng card trên mobile
                        <div className="space-y-3">
                          {displayFieldStats.slice(0, 7).map((stat, index) => (
                            <div key={index} className="border rounded-lg p-3 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: FIELD_TYPE_COLORS[stat.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2' }}
                                  />
                                  <span className="font-medium">{stat.displayName}</span>
                                  {index < 3 && <span className="ml-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">Phổ biến</span>}
                                </div>
                                <span className="text-sm font-semibold">{stat.value} ({stat.percent}%)</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${stat.percent}%`,
                                    backgroundColor: FIELD_TYPE_COLORS[stat.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          {displayFieldStats.length > 7 && (
                            <div className="mt-3 border rounded-lg overflow-hidden">
                              <details>
                                <summary className="p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 font-medium flex items-center">
                                  <span>Hiển thị thêm {displayFieldStats.length - 7} loại trường khác</span>
                                </summary>
                                <div className="p-3 space-y-3">
                                  {displayFieldStats.slice(7).map((stat, index) => (
                                    <div key={index} className="border-b pb-2 last:border-b-0 last:pb-0 pt-2 first:pt-0">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-2 h-2 rounded-full" 
                                            style={{ backgroundColor: FIELD_TYPE_COLORS[stat.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2' }}
                                          />
                                          <span className="text-sm">{stat.displayName}</span>
                                        </div>
                                        <span className="text-xs">{stat.value} ({stat.percent}%)</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          )}
                          <div className="mt-3 bg-primary/5 rounded-lg p-3 font-bold flex justify-between items-center">
                            <span>{t('home.total', 'Tổng cộng')}</span>
                            <span>{formFieldCount} (100%)</span>
                          </div>
                        </div>
                      ) : (
                        // Hiển thị dạng bảng trên desktop
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-primary/10">
                              <th className="text-left p-3 font-semibold rounded-tl-md">{t('home.fieldType', 'Loại trường')}</th>
                              <th className="text-center p-3 font-semibold">{t('home.count', 'Số lượng')}</th>
                              <th className="text-center p-3 font-semibold rounded-tr-md">{t('home.percentage', 'Tỉ lệ %')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayFieldStats.slice(0, 10).map((stat, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-muted/40 hover:bg-muted/60' : 'hover:bg-muted/30'}>
                                <td className="p-3 font-medium border-b flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2" 
                                    style={{ backgroundColor: FIELD_TYPE_COLORS[stat.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2' }}
                                  />
                                  {stat.displayName}
                                  {index < 3 && <span className="ml-2 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full text-xs font-medium">Phổ biến</span>}
                                </td>
                                <td className="p-3 text-center border-b">{stat.value}</td>
                                <td className="p-3 text-center border-b">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                      <div 
                                        className="h-2 rounded-full" 
                                        style={{ 
                                          width: `${stat.percent}%`,
                                          backgroundColor: FIELD_TYPE_COLORS[stat.name as keyof typeof FIELD_TYPE_COLORS] || '#00B1D2'
                                        }}
                                      />
                                    </div>
                                    <span>{stat.percent}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-primary/5 font-bold">
                              <td className="p-3 rounded-bl-md">{t('home.total', 'Tổng cộng')}</td>
                              <td className="p-3 text-center">{formFieldCount}</td>
                              <td className="p-3 text-center rounded-br-md">100%</td>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                    </div>
                    
                    {!isMobile && displayFieldStats.length > 10 && (
                      <div className="col-span-full mt-4">
                        <details className="border rounded-md overflow-hidden">
                          <summary className="p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 font-medium flex items-center">
                            <span>Hiển thị thêm {displayFieldStats.length - 10} loại trường khác</span>
                          </summary>
                          <div className="p-4">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left p-2 font-medium">{t('home.fieldType', 'Loại trường')}</th>
                                  <th className="text-center p-2 font-medium">{t('home.count', 'Số lượng')}</th>
                                  <th className="text-center p-2 font-medium">{t('home.percentage', 'Phần trăm')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayFieldStats.slice(10).map((stat, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{stat.displayName}</td>
                                    <td className="p-2 text-center">{stat.value}</td>
                                    <td className="p-2 text-center">{stat.percent}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}