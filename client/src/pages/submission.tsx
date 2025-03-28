import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { MainLayout } from '@/components/MainLayout';
import { fetchMenuRecords, updateSubmissionForm, submitFormData, fetchAllMenus } from '@/lib/api';
import { SubmissionForm, FormSubmission, Menu } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { SubmissionDataTable } from '@/components/SubmissionDataTable';
import { AddSubmissionDialog } from '@/components/AddSubmissionDialog';
import { useToast } from '@/hooks/use-toast';

export default function SubmissionPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId;
  
  // Truy vấn để lấy tất cả các menu để tìm menu phù hợp
  const { data: menusData } = useQuery({
    queryKey: ['/api/all-menus'],
    queryFn: async () => {
      const response = await fetchAllMenus();
      return response.data.core_core_dynamic_menus;
    }
  });

  // Tìm submenu từ workflowId
  const currentSubmenu = menusData?.find((menu: Menu) => menu.workflow_id === workflowId);
  const parentMenu = menusData?.find((menu: Menu) => menu.id === currentSubmenu?.parent_id);
  const menuIdToUse = currentSubmenu?.id || "7ffe9691-7f9b-430d-a945-16e0d9b173c4"; // ID mặc định

  // Sử dụng API QueryMenuRecord thay cho fetchSubmissionForms
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/menu-records', menuIdToUse],
    queryFn: async () => {
      const response = await fetchMenuRecords(menuIdToUse);
      return response.data.core_core_menu_records;
    },
    enabled: !!menuIdToUse
  });

  // Mutation để cập nhật dữ liệu submission form
  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ submissionId, submissionData }: { submissionId: string; submissionData: any[] }) => {
      return updateSubmissionForm(submissionId, submissionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-records', menuIdToUse] });
      toast({
        title: t('submission.updateSuccess', 'Cập nhật thành công'),
        description: t('submission.updateSuccessMessage', 'Dữ liệu biểu mẫu đã được cập nhật thành công.'),
      });
    },
    onError: (error) => {
      toast({
        title: t('submission.updateError', 'Lỗi cập nhật'),
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  });

  // Mutation để tạo mới submission form
  const createSubmissionMutation = useMutation({
    mutationFn: async (formData: FormSubmission) => {
      // Gọi API submitFormData với workflowId hiện tại
      return submitFormData(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-records', menuIdToUse] });
      toast({
        title: t('submission.createSuccess', 'Tạo mới thành công'),
        description: t('submission.createSuccessMessage', 'Biểu mẫu mới đã được tạo thành công.'),
      });
    },
    onError: (error) => {
      toast({
        title: t('submission.createError', 'Lỗi tạo mới'),
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  });

  // Xử lý khi lưu dữ liệu chỉnh sửa
  const handleSaveSubmission = async (submissionId: string, submissionData: any[]) => {
    try {
      await updateSubmissionMutation.mutateAsync({ submissionId, submissionData });
      return true;
    } catch (error) {
      console.error('Error saving submission:', error);
      return false;
    }
  };

  // Xử lý khi tạo mới submission form
  const handleCreateSubmission = async (newSubmission: FormSubmission) => {
    try {
      // Sử dụng submenu ID đã được tìm thấy ở trên
      const menuIdForSubmission = currentSubmenu?.id || parentMenu?.id || "aca06cb6-7dfa-4bda-89a8-42d8f3c18ec8";
      
      console.log("Found menu/submenu for workflow:", { 
        workflowId,
        submenuId: currentSubmenu?.id,
        parentMenuId: parentMenu?.id,
        menuIdToUse: menuIdForSubmission
      });
      
      // Thêm workflowId và menuId vào dữ liệu submission
      await createSubmissionMutation.mutateAsync({
        ...newSubmission,
        workflowId,
        menuId: menuIdForSubmission
      });
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={t('submission.title', 'Dữ liệu đã nộp')}>
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-block">
                <Skeleton className="h-8 w-[250px]" />
              </span>
            </CardTitle>
            <CardDescription>
              <span className="inline-block">
                <Skeleton className="h-4 w-[350px]" />
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout title={t('submission.title', 'Dữ liệu đã nộp')}>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t('error.title', 'Đã xảy ra lỗi')}
            </CardTitle>
            <CardDescription>
              {t('error.failedToLoad', 'Không thể tải dữ liệu biểu mẫu đã nộp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t('submission.title', 'Dữ liệu đã nộp')}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t('submission.formData', 'Dữ liệu biểu mẫu đã nộp')}</CardTitle>
            <CardDescription>
              {t('submission.description', 'Danh sách các biểu mẫu đã được gửi qua workflow này')}
            </CardDescription>
          </div>
          <AddSubmissionDialog 
            onSubmit={handleCreateSubmission}
            workflowId={workflowId}
          />
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">{t('submission.noData', 'Chưa có dữ liệu nào được gửi qua workflow này')}</p>
            </div>
          ) : (
            <SubmissionDataTable 
              data={data}
              onSave={async (editedData) => {
                // Lấy submission ID hiện tại
                const currentSubmission = data.find((s: any) => 
                  Array.isArray(s.submission_data) && 
                  editedData.length > 0 && 
                  s.submission_data.some((f: any) => f.id === editedData[0].id)
                );
                
                if (currentSubmission) {
                  const result = await handleSaveSubmission(currentSubmission.id, editedData);
                  return result;
                }
                
                throw new Error(t('submission.noSubmissionFound', 'Không tìm thấy biểu mẫu để cập nhật'));
              }}
            />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}