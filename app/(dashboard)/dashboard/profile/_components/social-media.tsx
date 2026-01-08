import React from "react";
import { Input, Card, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Title } = Typography;

const SocialMediaForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Card
      id="social-media"
      className="shadow-sm [&_.ant-card-body]:p-3 sm:[&_.ant-card-body]:p-5 md:[&_.ant-card-body]:p-6"
    >
      <Title level={4} className="mb-3 sm:mb-6 text-base sm:text-lg">
        Social Media URLs
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
        {/* Facebook */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Facebook URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="facebook_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.facebook_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://facebook.com/yourprofile"
                />
                {errors.facebook_url && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    {errors.facebook_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="instagram_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.instagram_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://instagram.com/yourprofile"
                />
                {errors.instagram_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.instagram_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Airbnb */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Airbnb URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="airbnb_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.airbnb_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://airbnb.com/yourprofile"
                />
                {errors.airbnb_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.airbnb_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* YouTube */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="youtube_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.youtube_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://youtube.com/yourchannel"
                />
                {errors.youtube_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.youtube_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Twitter/X */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X (Twitter) URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="twitter_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.twitter_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://x.com/yourprofile"
                />
                {errors.twitter_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.twitter_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="linkedin_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.linkedin_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.linkedin_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Pinterest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pinterest URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="pinterest_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.pinterest_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://pinterest.com/yourprofile"
                />
                {errors.pinterest_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.pinterest_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Vimeo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vimeo URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="vimeo_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.vimeo_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://vimeo.com/yourprofile"
                />
                {errors.vimeo_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.vimeo_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Trip Advisor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Advisor URL{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="top_advisor_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.top_advisor_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://tripadvisor.com/yourprofile"
                />
                {errors.top_advisor_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.top_advisor_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* VRBO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VRBO URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <Controller
            name="vrbo_url"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  size="large"
                  type="url"
                  status={errors.vrbo_url ? "error" : ""}
                  className="w-full"
                  placeholder="https://vrbo.com/yourprofile"
                />
                {errors.vrbo_url && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.vrbo_url.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default SocialMediaForm;
