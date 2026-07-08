import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authSchemas";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      login(response.data.token, response.data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="border border-slate-100 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-card/90 backdrop-blur-sm">
        <CardHeader className="space-y-1.5 pb-5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 h-10 transition-all duration-200 focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 transition-all duration-200 focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 h-10 font-medium text-sm shadow-md shadow-indigo-200/50 dark:shadow-none"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground text-[10px] tracking-wider font-semibold">
                New to JobTracker?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold transition-colors"
            >
              Create one for free
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
