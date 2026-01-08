"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { bffQuery } from "@/lib/bff-client";
import {
  Button,
  Skeleton,
  Avatar,
  Tag,
  Progress,
  Tooltip,
  Image,
  Card,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  MessageOutlined,
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  InstagramOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-center gap-3 border-b border-gray-200 py-3">
    <div className="text-gray-500">{icon}</div>
    <div className="min-w-[140px] text-gray-600 text-sm">{label}</div>
    <div className="font-semibold text-gray-800 flex-1">{value || "N/A"}</div>
  </div>
);

const StatusChip = ({
  label,
  verified,
}: {
  label: string;
  verified: boolean | null;
}) => {
  if (verified) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        <CheckCircleFilled />
        {label}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
      <CloseCircleFilled />
      {label}
    </div>
  );
};

const AdminViewUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  // Fetch user data via BFF
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => bffQuery(`/api/admin/users/${userId}/details`),
    select: (res) => res?.data,
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <Skeleton.Button active size="large" />
          <Skeleton active className="mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Skeleton active avatar paragraph={{ rows: 8 }} />
          </Card>
          <Card>
            <Skeleton active avatar paragraph={{ rows: 8 }} />
          </Card>
        </div>
      </div>
    );
  }

  const user = userData;

  return (
    <div className="w-full">
      {/* Header with Back and Edit Buttons */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/admin-dashboard/users")}
            size="large"
          >
            Back to Users
          </Button>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="large"
          onClick={() => router.push(`/admin-dashboard/users/edit/${userId}`)}
        >
          Edit Profile
        </Button>
      </div>

      <div className="space-y-6">
        {/* User Header Section */}
        <Card className="shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar
                size={120}
                src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/${user?.image}`}
                icon={<UserOutlined />}
                className="flex-shrink-0"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Hi, I am {user?.display_name || user?.first_name}
                </h2>
                <div className="flex gap-2 mt-2">
                  {user?.roles?.map((role: string) => (
                    <Tag key={role} color="blue">
                      {role.toUpperCase()}
                    </Tag>
                  ))}
                  {user?.status ? (
                    <Tag color="success">Active</Tag>
                  ) : (
                    <Tag color="error">Deactivated</Tag>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Profile Completeness - {user?.profile_completeness || 0}%
            </div>
            <Progress
              percent={user?.profile_completeness || 0}
              strokeColor="#AF2322"
            />
          </div>

          <div className="text-right">
            <Tooltip title="Chat will only be created once the booking is confirmed">
              <Button type="primary" icon={<MessageOutlined />} size="large">
                Chat with {user?.display_name || user?.first_name}
              </Button>
            </Tooltip>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Status Section */}
          <Card title="Verification Status" className="shadow-md">
            <div className="flex gap-2 flex-wrap mb-6">
              <StatusChip
                label="Email Verified"
                verified={!!user?.email_verified_at}
              />
              <StatusChip
                label="Driver's License Verified"
                verified={user?.driver_license_verified}
              />
              <StatusChip
                label="Airmen Certificate Verified"
                verified={user?.arimen_license_verified}
              />
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-700">
                Driving License Pictures
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {user?.driving_license ? (
                  <Image
                    src={
                      user.driving_license.startsWith("http://") ||
                      user.driving_license.startsWith("https://")
                        ? user.driving_license
                        : `${process.env.NEXT_PUBLIC_API_URI}/uploads/${user.driving_license}`
                    }
                    alt="Driving License Front"
                    className="rounded-lg"
                    height={150}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-[150px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {user?.driving_license_back ? (
                  <Image
                    src={
                      user.driving_license_back.startsWith("http://") ||
                      user.driving_license_back.startsWith("https://")
                        ? user.driving_license_back
                        : `${process.env.NEXT_PUBLIC_API_URI}/uploads/${user.driving_license_back}`
                    }
                    alt="Driving License Back"
                    className="rounded-lg"
                    height={150}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-[150px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-700">
                Airmen Certificate Pictures
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {user?.air_men ? (
                  <Image
                    src={
                      user.air_men.startsWith("http://") ||
                      user.air_men.startsWith("https://")
                        ? user.air_men
                        : `${process.env.NEXT_PUBLIC_API_URI}/uploads/${user.air_men}`
                    }
                    alt="Airmen Certificate Front"
                    className="rounded-lg"
                    height={150}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-[150px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {user?.air_men_back ? (
                  <Image
                    src={
                      user.air_men_back.startsWith("http://") ||
                      user.air_men_back.startsWith("https://")
                        ? user.air_men_back
                        : `${process.env.NEXT_PUBLIC_API_URI}/uploads/${user.air_men_back}`
                    }
                    alt="Airmen Certificate Back"
                    className="rounded-lg"
                    height={150}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-[150px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Information Section */}
          <div className="space-y-6">
            <Card title="Basic Information" className="shadow-md">
              <InfoRow
                icon={<UserOutlined />}
                label="Display Name"
                value={user?.display_name}
              />
              <InfoRow
                icon={<PhoneOutlined />}
                label="Phone Number"
                value={user?.phone}
              />
              <InfoRow
                icon={<PhoneOutlined />}
                label="Other Phone"
                value={user?.other_phone}
              />
              <InfoRow
                icon={<MailOutlined />}
                label="Email"
                value={user?.email}
              />
              <InfoRow
                icon={<MailOutlined />}
                label="Additional Email"
                value={user?.additional_email}
              />
              <InfoRow
                icon={<UserOutlined />}
                label="Native Language"
                value={user?.native_language?.join(", ")}
              />
              <InfoRow
                icon={<UserOutlined />}
                label="Other Language"
                value={user?.other_language?.join(", ")}
              />
              <InfoRow
                icon={<HomeOutlined />}
                label="Neighbourhood"
                value={user?.neighbourhood}
              />
            </Card>

            <Card title="Emergency Contact" className="shadow-md">
              <InfoRow
                icon={<UserOutlined />}
                label="Name"
                value={user?.contact_name}
              />
              <InfoRow
                icon={<PhoneOutlined />}
                label="Phone"
                value={user?.contact_phone}
              />
              <InfoRow
                icon={<MailOutlined />}
                label="Email"
                value={user?.contact_email}
              />
              <InfoRow
                icon={<UserOutlined />}
                label="Relationship"
                value={user?.contact_relationship}
              />
            </Card>
          </div>
        </div>

        {/* Address and Social Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mailing Address Section */}
          <Card title="Mailing Address" className="shadow-md">
            <InfoRow
              icon={<HomeOutlined />}
              label="Street Address"
              value={user?.address}
            />
            <InfoRow
              icon={<HomeOutlined />}
              label="Unit No"
              value={user?.unit_no?.toString()}
            />
            <InfoRow icon={<HomeOutlined />} label="City" value={user?.city} />
            <InfoRow
              icon={<HomeOutlined />}
              label="State"
              value={user?.state}
            />
            <InfoRow
              icon={<HomeOutlined />}
              label="Zip / Postal Code"
              value={user?.zip_code}
            />
            <InfoRow
              icon={<HomeOutlined />}
              label="Country"
              value={user?.country}
            />
          </Card>

          {/* Social Profiles Section */}
          <Card title="Social Profiles" className="shadow-md">
            <InfoRow
              icon={<FacebookFilled />}
              label="Facebook"
              value={user?.facebook_url}
            />
            <InfoRow
              icon={<GoogleOutlined />}
              label="Google Plus"
              value={user?.google_plus_url}
            />
            <InfoRow
              icon={<InstagramOutlined />}
              label="Instagram"
              value={user?.instagram_url}
            />
            <InfoRow
              icon={<LinkedinFilled />}
              label="LinkedIn"
              value={user?.linkedin_url}
            />
            <InfoRow
              icon={<TwitterOutlined />}
              label="Twitter"
              value={user?.twitter_url}
            />
            <InfoRow
              icon={<UserOutlined />}
              label="YouTube"
              value={user?.youtube_url}
            />
            <InfoRow
              icon={<UserOutlined />}
              label="Vimeo"
              value={user?.vimeo_url}
            />
            <InfoRow
              icon={<UserOutlined />}
              label="Airbnb"
              value={user?.airbnb_url}
            />
            <InfoRow
              icon={<UserOutlined />}
              label="Trip Advisor"
              value={user?.top_advisor_url}
            />
          </Card>
        </div>

        {/* Bio Section */}
        {user?.bio && (
          <Card title="About Me" className="shadow-md">
            <p className="text-gray-700">{user.bio}</p>
          </Card>
        )}

        {/* Account Information */}
        <Card title="Account Information" className="shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Account Type</div>
              <div className="font-semibold text-gray-800">
                {user?.account_type || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Is Host</div>
              <div className="font-semibold text-gray-800">
                {user?.is_host ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Stays Count</div>
              <div className="font-semibold text-gray-800">
                {user?.stays_count || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Newsletter Subscribed</div>
              <div className="font-semibold text-gray-800">
                {user?.is_subscribed_to_newsletter ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="font-semibold text-gray-800">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Last Updated</div>
              <div className="font-semibold text-gray-800">
                {user?.updated_at
                  ? new Date(user.updated_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminViewUserPage;
