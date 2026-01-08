"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApp } from "../../../../providers/AppMessageProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { message } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");
  interface LoginFormData {
    username: string;
    password: string;
  }

  const loginSchema = yup.object({
    username: yup.string().required("Email or username is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false, // Handle redirect manually
      });

      setIsLoading(false);

      if (result?.error) {
        message.error(result.error);
        setError(result.error);
      } else if (result?.ok) {
        message.success("Login successful! Redirecting...");

        // Fetch the fresh session to get user roles
        const session = await getSession();
        console.log("Fresh session after login:", session);

        // If returnUrl is provided (e.g., from booking flow), redirect there
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
          return;
        }

        // Check user role and redirect accordingly
        const userRoles = (session?.user as any)?.roles || [];
        const isAdmin = userRoles.includes("admin");

        const redirectPath = isAdmin
          ? "/admin-dashboard"
          : "/dashboard/profile";
        router.push(redirectPath);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed";
      message.error(errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      message.error("No credential received from Google");
      return;
    }

    try {
      // Call NextAuth credentials provider with Google token
      const result = await signIn("credentials", {
        username: "google_oauth", // Special identifier
        password: credentialResponse.credential, // Pass Google token as password
        redirect: false,
      });

      if (result?.error) {
        message.error(result.error);
        setError(result.error);
      } else if (result?.ok) {
        message.success("Google login successful! Redirecting...");

        // Fetch the fresh session to get user roles
        const session = await getSession();
        console.log("Fresh session after Google login:", session);

        // If returnUrl is provided (e.g., from booking flow), redirect there
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
          return;
        }

        // Check user role and redirect accordingly
        const userRoles = (session?.user as any)?.roles || [];
        const isAdmin = userRoles.includes("admin");

        const redirectPath = isAdmin
          ? "/admin-dashboard"
          : "/dashboard/profile";
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error("Google login failed. Please try again.");
      setError("Google login failed");
    }
  };

  const handleGoogleError = () => {
    message.error("Google login failed. Please try again.");
    setError("Google login failed");
  };

  return (
    <div className="flex flex-col w-full min-h-screen md:flex-row">
      {/* Left side - Red background with airplane */}
      <div className="relative hidden overflow-hidden bg-red-700 md:flex md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/airplane-bg.png"
            alt="Airplane"
            fill
            className="object-cover mix-blend-luminosity"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col p-6 md:p-12">
          <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-5xl">
            Welcome Back!
          </h1>
          <p className="text-lg text-white md:text-2xl">
            One stop Solution to all your Aviation Needs.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-white md:w-1/2 sm:p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6 md:mb-8">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/assets/images/FlyInn Logo.png"
                alt="FLY-INN Logo"
                width={160}
                height={80}
                className="w-32 h-auto md:w-48"
              />
            </Link>
          </div>

          <h2 className="mb-6 text-2xl font-bold text-gray-800 md:mb-8 md:text-3xl text-start">
            Sign In
          </h2>

          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              size="large"
              width="100%"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mb-3 input-container">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Email Address
              </label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    size="large"
                    className="w-full "
                  />
                )}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-3 input-container">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    iconRender={(visible) =>
                      visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                    }
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-red-700"
              >
                Forgot Password?
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm text-gray-600 hover:text-red-700"
              >
                Create Account
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full  text-white"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
