"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApp } from "../../../../providers/AppMessageProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const defaultValues = {
  email: "",
};

// OTP resend timer: 1 minute (60 seconds)
const OTP_RESEND_TIMER_SECONDS = 60;

const ForgotPasswordPage = () => {
  const { message } = useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"email" | "otp" | "password">(
    "email"
  );
  const [timer, setTimer] = useState(OTP_RESEND_TIMER_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const otpSchema = yup.object({
    otp: yup
      .string()
      .required("OTP is required")
      .min(4, "Enter 4 digits")
      .max(4, "Enter 4 digits"),
  });

  const passwordSchema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*]/,
        "Password must contain at least one special character (!, @, #, $, %, ^, &, *)"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    getValues: getEmailValues,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues,
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch: watchPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Calculate password strength
  const password = watchPassword("password");
  const passwordStrength = useMemo(() => {
    const pwd = password || "";
    let score = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const hasLength = pwd.length >= 8;
    score += hasLower ? 1 : 0;
    score += hasUpper ? 1 : 0;
    score += hasNumber ? 1 : 0;
    score += hasSpecial ? 1 : 0;
    score += hasLength ? 1 : 0;

    const percent = (score / 5) * 100;
    let label = "Too weak";
    let color = "bg-red-500";
    if (score === 2) {
      label = "Weak";
      color = "bg-orange-500";
    } else if (score === 3) {
      label = "Fair";
      color = "bg-yellow-500";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-green-500";
    } else if (score === 5) {
      label = "Very strong";
      color = "bg-emerald-600";
    }
    return { percent, label, color, score };
  }, [password]);

  // API mutation for sending OTP
  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        throw new Error(error.message || error.error || "Failed to send OTP");
      }

      return response.json();
    },
    onSuccess: (response: any) => {
      console.log("Forgot password response:", response);
      if (
        response?.success === true ||
        response?.statusCode === 200 ||
        response?.status === true
      ) {
        console.log("Success - navigating to OTP step");
        message.success(
          response?.message || "OTP sent successfully to your email!"
        );
        setCurrentStep("otp");
        startTimer();
      } else {
        console.log("Failed - status is not true");
        message.error(
          response?.message || "Failed to send OTP. Please try again."
        );
      }
    },
    onError: (error: any) => {
      console.log("Forgot password error:", error);
      const errorMessage =
        error?.message ||
        "An error occurred while processing your request. Please try again later.";
      message.error(errorMessage);
    },
  });

  // API mutation for verifying OTP
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          token: data.otp, // Backend expects "token", not "otp"
        }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        throw new Error(error.message || error.error || "Invalid OTP");
      }

      return response.json();
    },
    onSuccess: (response: any) => {
      console.log("OTP verification response:", response);
      if (
        response?.success === true ||
        response?.statusCode === 200 ||
        response?.status === true
      ) {
        message.success("OTP verified successfully!");
        setCurrentStep("password");
      } else {
        message.error(response?.message || "Invalid OTP. Please try again.");
      }
    },
    onError: (error: any) => {
      message.error(error?.message || "Invalid OTP. Please try again.");
    },
  });

  // API mutation for updating password
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: async (data: {
        email: string;
        otp: string;
        password: string;
        password_confirmation: string;
      }) => {
        const response = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Request failed" }));
          throw new Error(
            error.message || error.error || "Failed to update password"
          );
        }

        return response.json();
      },
      onSuccess: () => {
        message.success("Password updated successfully!");
        // Delay redirect to allow message to be shown
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      },
      onError: (error: any) => {
        message.error(
          error?.message || "Failed to update password. Please try again."
        );
      },
    }
  );

  const startTimer = () => {
    setTimer(OTP_RESEND_TIMER_SECONDS);
    setIsResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onEmailSubmit = async (data: { email: string }) => {
    sendOtp({ email: data.email });
  };

  const onOtpSubmit = async (data: any) => {
    setVerifiedOtp(data.otp);
    const email = getEmailValues("email");
    verifyOtp({
      email: email,
      otp: data.otp,
    });
  };

  const onPasswordSubmit = async (data: any) => {
    const email = getEmailValues("email");
    updatePassword({
      email: email,
      otp: verifiedOtp,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
  };

  const handleResendOtp = () => {
    if (!isResendDisabled) {
      const email = getEmailValues("email");
      if (email) {
        sendOtp({ email });
      }
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen md:flex-row">
      {/* Left side - Red background with airplane */}
      <div className="relative hidden overflow-hidden bg-red-700 md:flex md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/airplane-bg-reset.png"
            alt="Airplane"
            fill
            className="object-cover mix-blend-luminosity"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col p-6 md:p-12">
          <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-5xl">
            Password Reset
          </h1>
          <p className="text-lg text-white md:text-2xl">
            One stop Solution to all your Aviation Needs.
          </p>
        </div>
      </div>

      {/* Right side - Forgot Password form */}
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
            {currentStep === "email" && "Forgot Password?"}
            {currentStep === "otp" && "Verify OTP"}
            {currentStep === "password" && "Set New Password"}
          </h2>

          {currentStep === "email" && (
            // Email Form
            <form
              onSubmit={handleEmailSubmit(onEmailSubmit)}
              className="w-full space-y-4"
            >
              <div className="input-container">
                <label className="block mb-1 text-sm">Email Address</label>
                <Controller
                  name="email"
                  control={emailControl}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      size="large"
                      className="w-full"
                      placeholder="Enter your email address"
                    />
                  )}
                />
                {emailErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {emailErrors.email.message?.toString()}
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                We'll send a 4-digit OTP to your email address to reset your
                password.
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> The OTP will be valid for 15 minutes
                  after you receive it.
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full text-white"
                  loading={isSendingOtp}
                >
                  Send OTP
                </Button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-gray-700">Remember your password? </span>
                <Link
                  href="/auth/login"
                  className="text-red-700 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          )}

          {currentStep === "otp" && (
            // OTP Form
            <form
              onSubmit={handleOtpSubmit(onOtpSubmit)}
              className="w-full space-y-4"
            >
              <div className="text-sm text-gray-600 mb-4">
                We've sent a 4-digit OTP to your email address. Please enter it
                below to verify your identity.
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800">
                  <strong>⏱️ Time Limit:</strong> Your OTP is valid for 15
                  minutes from the time it was sent. Please verify it before it
                  expires.
                </p>
              </div>

              <div className="input-container">
                <label className="block mb-1 text-sm">Enter OTP</label>
                <Controller
                  name="otp"
                  control={otpControl}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      size="large"
                      className="w-full text-center text-lg tracking-widest"
                      placeholder="0000"
                      maxLength={4}
                      pattern="[0-9]*"
                    />
                  )}
                />
                {otpErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {otpErrors.otp.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full text-white"
                  loading={isVerifyingOtp}
                >
                  Verify OTP
                </Button>
              </div>

              <div className="text-center mt-4">
                <Button
                  type="text"
                  disabled={isResendDisabled}
                  onClick={handleResendOtp}
                  className="text-red-700 disabled:opacity-50"
                >
                  {isResendDisabled
                    ? `Resend OTP in ${String(
                        Math.floor(timer / OTP_RESEND_TIMER_SECONDS)
                      ).padStart(2, "0")}:${String(
                        timer % OTP_RESEND_TIMER_SECONDS
                      ).padStart(2, "0")}`
                    : "Resend OTP"}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-gray-700">Remember your password? </span>
                <Link
                  href="/auth/login"
                  className="text-red-700 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          )}

          {currentStep === "password" && (
            // Password Form
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="w-full space-y-4"
            >
              <div className="text-sm text-gray-600 mb-4">
                Please enter your new password. Make sure it's strong and
                secure.
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-800">
                  <strong>⏱️ Session Expiry:</strong> You have 30 minutes from
                  OTP verification to update your password. After that, you'll
                  need to start over.
                </p>
              </div>

              <div className="input-container">
                <label className="block mb-1 text-sm">New Password</label>
                <Controller
                  name="password"
                  control={passwordControl}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="Enter your new password"
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
                {passwordErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.password.message?.toString()}
                  </p>
                )}
                {password && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.percent}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-gray-600">
                      Strength:{" "}
                      <span className="font-medium">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="input-container">
                <label className="block mb-1 text-sm">Confirm Password</label>
                <Controller
                  name="confirmPassword"
                  control={passwordControl}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="Confirm your new password"
                      iconRender={(visible) =>
                        visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                      }
                      visibilityToggle={{
                        visible: confirmPasswordVisible,
                        onVisibleChange: setConfirmPasswordVisible,
                      }}
                    />
                  )}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.confirmPassword.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full text-white"
                  loading={isUpdatingPassword}
                >
                  Update Password
                </Button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-gray-700">Remember your password? </span>
                <Link
                  href="/auth/login"
                  className="text-red-700 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
