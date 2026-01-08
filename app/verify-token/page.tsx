"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "../../providers/AppMessageProvider";

const VerifyTokenPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { message } = useApp();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage(
          "Token is missing. Please check your verification link."
        );
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data?.success) {
          setStatus("success");
          message.success("Email verified successfully!");
          // Redirect to login after 3 seconds
          //   setTimeout(() => {
          //     router.push("/auth/login");
          //   }, 3000);
        } else {
          setStatus("error");
          setErrorMessage(data?.message || "Token verification failed.");
        }
      } catch (error: any) {
        setStatus("error");

        // Handle different error scenarios
        const errorMsg =
          error?.message ||
          "An error occurred while verifying your email. Please try again.";
        setErrorMessage(errorMsg);
        message.error(errorMsg);
      }
    };

    verifyToken();
  }, [token, message, router]);

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
            Email Verification
          </h1>
          <p className="text-lg text-white md:text-2xl">
            One stop Solution to all your Aviation Needs.
          </p>
        </div>
      </div>

      {/* Right side - Verification status */}
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

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {status === "loading" && (
              <div className="space-y-6">
                <Spin size="large" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Verifying Your Email
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we verify your email address...
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <CheckCircleOutlined
                    style={{ fontSize: "80px", color: "#10b981" }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Email Verified Successfully!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your email address has been verified. You can now sign in to
                    your account.
                  </p>
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="w-full text-white"
                  onClick={() => router.push("/auth/login")}
                >
                  Go to Sign In
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <CloseCircleOutlined
                    style={{ fontSize: "80px", color: "#ef4444" }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600 mb-4">{errorMessage}</p>
                </div>
                <div className="space-y-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full text-white"
                    onClick={() => router.push("/auth/login")}
                  >
                    Go to Sign In
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    className="w-full"
                    onClick={() => router.push("/auth/signup")}
                  >
                    Create New Account
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-red-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenPage;
