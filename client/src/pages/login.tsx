import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Thông báo",
        description: "Vui lòng nhập đầy đủ thông tin đăng nhập",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Demo login để dễ dàng sử dụng
      // Bình thường sẽ gọi API thực tế để xác thực
      const demoUser = {
        id: 1,
        username: username,
        email: "user@example.com",
        displayName: "Demo User",
      };
      
      // Lưu token giả vào localStorage
      localStorage.setItem("token", "demo-token-123");
      localStorage.setItem("user", JSON.stringify(demoUser));

      toast({
        title: "Thành công",
        description: "Đăng nhập thành công",
      });
      
      // Redirect về trang chủ
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Lỗi đăng nhập",
        description: "Tên đăng nhập hoặc mật khẩu không chính xác",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4"></div>
          <CardTitle className="text-2xl text-center">SmartUI MES</CardTitle>
          <CardDescription className="text-center">
            Hệ thống quản lý sản xuất thông minh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                hoặc đăng nhập với
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2" 
            onClick={() => {
              // Demo xử lý đăng nhập Google
              toast({
                title: "Google Login",
                description: "Đang xử lý đăng nhập với Google...",
              });
              
              // Giả lập đăng nhập thành công sau 1 giây
              setTimeout(() => {
                const googleUser = {
                  id: 2,
                  username: "googleuser",
                  email: "googleuser@gmail.com",
                  displayName: "Google User",
                  profilePicture: "https://lh3.googleusercontent.com/a/default-user"
                };
                
                localStorage.setItem("token", "google-token-456");
                localStorage.setItem("user", JSON.stringify(googleUser));
                
                toast({
                  title: "Thành công",
                  description: "Đăng nhập bằng Google thành công"
                });
                
                setLocation("/");
              }, 1000);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập với Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <p className="text-xs text-center text-muted-foreground">
            Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng của chúng
            tôi
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
