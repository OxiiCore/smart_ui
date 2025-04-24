import { Switch, Route, useRoute, RouteComponentProps } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/MainLayout";
import { MainSidebar } from "@/components/MainSidebar";
import Home from "@/pages/home";
import FormsPage from "@/pages/forms";
import StandaloneFormPage from "@/pages/StandaloneFormPage";
import WorkflowPage from "@/pages/workflow";
import SubmissionPage from "@/pages/submission";
import DesignExamplePage from "@/pages/design-example";
import RecordDetailPage from "@/pages/record-detail";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { setupInitialTheme } from "@/lib/theme";
import { MobileSidebarProvider } from "@/hooks/use-mobile-sidebar";

// Wrapper components for all route components
const FormsPageWrapper = (_props: RouteComponentProps) => <FormsPage />;
const HomeWrapper = (_props: RouteComponentProps) => <Home />;
const WorkflowPageWrapper = (_props: RouteComponentProps) => <WorkflowPage />;
const SubmissionPageWrapper = (_props: RouteComponentProps) => <SubmissionPage />;
const DesignExamplePageWrapper = (_props: RouteComponentProps) => <DesignExamplePage />;
const RecordDetailPageWrapper = (_props: RouteComponentProps) => <RecordDetailPage />;
const NotFoundWrapper = (_props: RouteComponentProps) => <NotFound />;

// Hàm kiểm tra xem có đang ở trang StandaloneForm không
function useIsStandaloneForm() {
  const [match] = useRoute('/form/:id');
  return match;
}

function Router() {
  // Kiểm tra xem có đang ở trang form đứng một mình không
  const isStandaloneForm = useIsStandaloneForm();

  // Nếu đang ở trang form đứng một mình, chỉ hiển thị StandaloneFormPage
  if (isStandaloneForm) {
    return <StandaloneFormPage />;
  }

  // Ngược lại, hiển thị router bình thường với layout đầy đủ
  return (
    <Switch>
      <Route path="/" component={HomeWrapper} />
      <Route path="/forms" component={FormsPageWrapper} />
      <Route path="/workflow" component={WorkflowPageWrapper} />
      <Route path="/menu/:menuId" component={WorkflowPageWrapper} />
      <Route path="/menu/:menuId/submenu/:subMenuId" component={WorkflowPageWrapper} />
      <Route path="/submission/:workflowId" component={SubmissionPageWrapper} />
      <Route path="/record/:menuId/:recordId" component={RecordDetailPageWrapper} />
      <Route path="/record/:menuId/:recordId/workflow/:workflowId" component={RecordDetailPageWrapper} />
      <Route path="/design" component={DesignExamplePageWrapper} />
      <Route component={NotFoundWrapper} />
    </Switch>
  );
}

function App() {
  // Setup theme on initial render
  useEffect(() => {
    setupInitialTheme();
  }, []);

  // Kiểm tra xem có đang ở trang standalone form không
  const isStandaloneForm = useIsStandaloneForm();

  return (
    <QueryClientProvider client={queryClient}>
      <MobileSidebarProvider>
        {isStandaloneForm ? (
          // Nếu là trang standalone form, hiển thị trực tiếp không có sidebar
          <Router />
        ) : (
          // Ngược lại, sử dụng layout đầy đủ với sidebar
          <MainSidebar>
            <Router />
          </MainSidebar>
        )}
        <Toaster />
      </MobileSidebarProvider>
    </QueryClientProvider>
  );
}

export default App;