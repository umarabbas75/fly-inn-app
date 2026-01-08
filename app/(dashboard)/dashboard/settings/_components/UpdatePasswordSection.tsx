"use client";

import React, { useState } from "react";
import { Button, Input, Card, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { bffMutation } from "@/lib/bff-client";

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character (!, @, #, $, %, ^, &, *)"
    )
    .test(
      "different-from-current",
      "New password must be different from your current password",
      function (value) {
        const { currentPassword } = this.parent;
        return !currentPassword || value !== currentPassword;
      }
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdatePasswordSection: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  // Calculate password strength
  const passwordStrength = () => {
    if (!newPassword) return { percent: 0, label: "", color: "" };

    let strength = 0;
    if (newPassword.length >= 8) strength += 20;
    if (/[a-z]/.test(newPassword)) strength += 20;
    if (/[A-Z]/.test(newPassword)) strength += 20;
    if (/[0-9]/.test(newPassword)) strength += 20;
    if (/[!@#$%^&*]/.test(newPassword)) strength += 20;

    if (strength <= 40) {
      return { percent: strength, label: "Weak", color: "bg-red-500" };
    } else if (strength <= 60) {
      return { percent: strength, label: "Fair", color: "bg-orange-500" };
    } else if (strength <= 80) {
      return { percent: strength, label: "Good", color: "bg-yellow-500" };
    } else {
      return { percent: strength, label: "Strong", color: "bg-green-500" };
    }
  };

  const strength = passwordStrength();

  // API mutation for changing password
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: async (data: PasswordFormData) => {
        return bffMutation("/api/users/change-password", {
          method: "PATCH",
          body: {
            current_password: data.currentPassword,
            new_password: data.newPassword,
          },
        });
      },
      onSuccess: (response: any) => {
        if (
          response?.success === true ||
          response?.status === true ||
          response?.statusCode === 200
        ) {
          message.success(
            response?.message || "Password changed successfully!"
          );
          reset(); // Clear form
        } else {
          message.error(response?.message || "Failed to change password");
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message ||
          "Failed to change password. Please check your current password and try again.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = async (data: PasswordFormData) => {
    changePassword(data);
  };

  return (
    <Card className="shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <LockOutlined className="text-2xl text-[#AF2322]" />
          <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Change your account password. Make sure to use a strong password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="Enter your current password"
                iconRender={(visible) =>
                  visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
                status={errors.currentPassword ? "error" : ""}
              />
            )}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="Enter your new password"
                iconRender={(visible) =>
                  visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
                status={errors.newPassword ? "error" : ""}
              />
            )}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
          {newPassword && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded transition-all ${strength.color}`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                Strength: <span className="font-medium">{strength.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="Confirm your new password"
                iconRender={(visible) =>
                  visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
                status={errors.confirmPassword ? "error" : ""}
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one number</li>
            <li>
              • Contains at least one special character (!, @, #, $, %, ^, &, *)
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isChangingPassword}
            className="bg-[#AF2322] hover:bg-[#9e1f1a]"
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UpdatePasswordSection;
