"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input, Checkbox } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApp } from "../../../../providers/AppMessageProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

const defaultValues = {
  email: "",
  password: "",
  password_confirm: "",
  termsAgreed: false,
  newsletter: false,
  phone: "",
};
const SignupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const { message } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");
  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
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
    password_confirm: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
    termsAgreed: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions"),
    phone: yup
      .string()
      .required("Cell phone number is required")
      .test(
        "is-valid-phone",
        "The phone number is incomplete or invalid. Please check your entry",
        (value) => {
          // If value is null, undefined, or empty string,
          // let the 'required' rule handle it.
          if (!value) {
            return true;
          }
          // Explicitly return boolean result of validation functions
          return isPossiblePhoneNumber(value) && isValidPhoneNumber(value);
        }
      ),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: yupResolver(signupSchema),
    defaultValues,
    mode: "onChange", // Enable real-time validation
  });

  const passwordValue: string = watch("password");
  const confirmPasswordValue: string = watch("password_confirm");

  const passwordStrength = useMemo(() => {
    const pwd = passwordValue || "";
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
  }, [passwordValue]);

  const onReCAPTCHAChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const {
    mutate: registerUser,
    isPending,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/auth/signup", {
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
        throw new Error(error.message || error.error || "Signup failed");
      }

      return response.json();
    },
    onSuccess: (res: any) => {
      setSignupSuccess(true);
      setUserEmail(watch("email"));
      setVerificationLink(res?.data?.verification_link || "");
      reset(defaultValues);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    },
    onError: (error: any) => {
      message.error(
        error?.message || "An error occurred during signup. Please try again."
      );
      // Reset reCAPTCHA on error so user must complete it again
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    },
  });

  // Google signup - uses NextAuth signIn to create proper session
  const handleGoogleSignup = async (credential: string) => {
    try {
      // Call NextAuth credentials provider with Google token
      const result = await signIn("credentials", {
        username: "google_oauth", // Special identifier for Google OAuth
        password: credential, // Pass Google token as password
        redirect: false,
      });

      if (result?.error) {
        message.error(result.error);
      } else if (result?.ok) {
        message.success("Google signup successful! Redirecting...");

        // Fetch the fresh session to get user roles
        const session = await getSession();
        console.log("Fresh session after Google signup:", session);

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
      console.error("Google signup error:", error);
      message.error("Google signup failed. Please try again.");
    }
  };

  const onSubmit = async (data: any) => {
    if (!recaptchaToken) {
      message.error("Please complete the reCAPTCHA challenge.");
      return;
    }

    const { termsAgreed, newsletter, ...rest } = data;
    registerUser({ ...rest, recaptchaToken });
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      handleGoogleSignup(credentialResponse.credential);
    } else {
      message.error("No credential received from Google");
    }
  };

  const handleGoogleError = () => {
    message.error("Google signup failed. Please try again.");
  };

  return (
    <div className="flex flex-col w-full min-h-screen md:flex-row">
      {/* Left side - Red background with airplane */}
      <div className="relative hidden overflow-hidden bg-red-700 md:flex md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/airplane-bg-signup.png"
            alt="Airplane"
            fill
            className="object-cover mix-blend-luminosity"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col p-6 md:p-12">
          <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-5xl">
            Ready for Take Off?
          </h1>
          <p className="text-lg text-white md:text-2xl">
            One stop Solution to all your Aviation Needs.
          </p>
        </div>
      </div>

      {/* Right side - Signup form */}
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

          {signupSuccess ? (
            /* Success Message */
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-2">
                  We've sent a verification link to
                </p>
                <p className="text-gray-800 font-semibold mb-4">{userEmail}</p>
                <p className="text-sm text-gray-600">
                  Please check your{" "}
                  <strong>email inbox (or spam or promotions)</strong> and click
                  the verification link to activate your account. The link will
                  expire in 24 hours.
                </p>
              </div>

              {/* {verificationLink && (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    📧 Email Delayed? Verify Now
                  </p>
                  <p className="text-xs text-blue-700 mb-3">
                    Click the button below to verify your account instantly
                    without waiting for the email.
                  </p>
                  <Button
                    type="default"
                    size="large"
                    className="w-full border-blue-400 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      window.location.href = verificationLink;
                    }}
                  >
                    Verify Email Now
                  </Button>
                </div>
              )} */}

              <div className="w-full space-y-3 pt-4">
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  onClick={() => router.push("/auth/login")}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <>
              <h2 className="mb-6 text-2xl font-bold text-gray-800 md:mb-8 md:text-3xl text-start">
                Sign Up
              </h2>

              {/* Google Signup Button */}
              <div className="w-full flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signup_with"
                  size="large"
                  width="384"
                />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with email
                  </span>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="input-container">
                  <label className="block mb-1 text-sm font-medium text-gray-900">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        size="large"
                        className="w-full"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="input-container">
                  <label className="block mb-1 text-sm font-medium text-gray-900">
                    Phone Number
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    First, click the flag icon to select your country. This will
                    automatically insert your country code. Then enter your
                    phone number, starting with the appropriate regional or
                    local code for your number.
                  </p>
                </div>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex flex-col" id="phone">
                      <PhoneInput
                        placeholder="Enter phone number"
                        defaultCountry="US"
                        value={value || undefined}
                        international={true}
                        countryCallingCodeEditable={false}
                        withCountryCallingCode={true}
                        onChange={(value) => {
                          onChange(value || null);
                        }}
                        className={` border h-10 pl-2.5 rounded-[8px] border-[#d9d9d9] text-base border-solid`} // Removing outline and focus ring
                      />

                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message?.toString()}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="input-container">
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message?.toString()}
                    </p>
                  )}
                  {/* Password strength indicator */}
                  {passwordValue && (
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
                  <label className="block mb-1 text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <Controller
                    name="password_confirm"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        size="large"
                        status={
                          confirmPasswordValue &&
                          passwordValue &&
                          confirmPasswordValue !== passwordValue
                            ? "error"
                            : undefined
                        }
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
                  {/* Real-time password match validation */}
                  {confirmPasswordValue && passwordValue && (
                    <div className="mt-1">
                      {confirmPasswordValue === passwordValue ? (
                        <p className="text-green-600 text-xs flex items-center gap-1">
                          <CheckCircleOutlined className="text-green-600" />
                          Passwords match
                        </p>
                      ) : (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <ExclamationCircleOutlined className="text-red-500" />
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  )}
                  {errors.password_confirm && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password_confirm.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3  mt-4">
                  <div>
                    <Controller
                      name="termsAgreed"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-start">
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={field.onChange}
                            id="terms-agreed"
                          />
                          <label
                            htmlFor="terms-agreed"
                            className="ml-2 text-xs text-gray-700 md:text-sm cursor-pointer"
                          >
                            I agree to the{" "}
                            <Link
                              href="/public/terms-of-service"
                              prefetch={false}
                              className="text-red-700 hover:underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/public/privacy-policy"
                              prefetch={false}
                              className="text-red-700 hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      )}
                    />
                    {errors.termsAgreed && (
                      <p className="text-red-500 text-xs ">
                        {errors.termsAgreed.message?.toString()}
                      </p>
                    )}
                  </div>

                  {/* <Controller
                    name="newsletter"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-start">
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                          id="newsletter"
                        />
                        <label
                          htmlFor="newsletter"
                          className="ml-2 text-xs text-gray-700 md:text-sm cursor-pointer"
                        >
                          Subscribe to our newsletter
                        </label>
                      </div>
                    )}
                  /> */}
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center mt-4">
                  <ReCAPTCHA
                    ref={recaptchaRef as any}
                    sitekey={
                      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
                    }
                    onChange={onReCAPTCHAChange}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full  text-white disabled:!bg-primary/60 !bg-primary"
                    loading={isPending}
                    disabled={!recaptchaToken}
                  >
                    Create my Account
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-gray-700">
                    Already have an Account?{" "}
                  </span>
                  <Link
                    href="/auth/login"
                    className=" text-red-700 hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
