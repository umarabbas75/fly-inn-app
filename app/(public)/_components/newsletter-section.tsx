import React, { useState } from "react";
import { Input, Button, Form } from "antd"; // Import Form and message
import { FiMail, FiSend } from "react-icons/fi";
import { LoadingOutlined } from "@ant-design/icons"; // For loading spinner
import { useApp } from "@/providers/AppMessageProvider";

const NewsletterSection = () => {
  const { message } = useApp();
  const [form] = Form.useForm(); // Hook to get form instance
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false); // To show success message

  const onFinish = async (values: any) => {
    setLoading(true);
    setSubscribed(false); // Reset subscribed state on new attempt

    try {
      // Simulate an API call
      // In a real application, you would send values.email to your backend
      console.log("Submitting email:", values.email);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      message.success("Successfully subscribed to our newsletter!");
      setSubscribed(true);
      form.resetFields(); // Clear the input field
    } catch (error) {
      console.error("Subscription failed:", error);
      message.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center ">
      {/* Decorative elements */}
      <div className="relative mb-6">
        <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#AF2322]/20"></div>
        <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-[#AF2322]/20"></div>
        <FiMail className="mx-auto text-4xl text-[#AF2322]" />
      </div>

      <h3 className="mb-3 text-3xl font-bold text-gray-900">
        Stay Updated with FLY-INN
      </h3>
      <p className="max-w-2xl mb-8 text-lg text-gray-600">
        Join our aviation community and receive exclusive offers, property
        updates, and travel tips directly to your inbox.
      </p>

      <Form
        form={form} // Assign the form instance
        name="newsletter"
        onFinish={onFinish} // Called on successful validation
        layout="vertical" // Or 'horizontal', 'inline'
        className="flex flex-col w-full max-w-md gap-4 sm:flex-row" // Apply flex styles to the form itself
        // NoValidate // HTML5 validation is handled by Ant Design rules
      >
        <Form.Item
          name="email" // Name of the field, used to access its value in onFinish
          noStyle // Prevents Ant Design from adding default styling/margin
          rules={[
            {
              required: true,
              message: "Please enter your email address!",
            },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
          className="flex-grow" // Allows input to grow in flex layout
        >
          <Input
            placeholder="Your email address"
            className="h-12 px-4 text-base border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]"
            suffix={<FiMail className="text-gray-400" />}
            disabled={loading} // Disable input when loading
          />
        </Form.Item>

        <Form.Item noStyle>
          {" "}
          {/* Button doesn't need Form.Item for validation */}
          <Button
            type="primary"
            htmlType="submit" // Crucial: Makes this button submit the form
            className="flex items-center justify-center h-12 gap-2 text-base font-semibold"
            style={{ backgroundColor: "#AF2322" }}
            icon={loading ? <LoadingOutlined /> : <FiSend />} // Show loading spinner
            loading={loading} // Ant Design's loading prop for button
            disabled={loading} // Explicitly disable button when loading
          >
            Subscribe
          </Button>
        </Form.Item>
      </Form>

      {/* Success Message */}
      {subscribed && (
        <p className="mt-4 text-sm text-green-600">
          Thank you for subscribing! Check your inbox.
        </p>
      )}

      <p className="mt-2 text-sm text-gray-500">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSection;
