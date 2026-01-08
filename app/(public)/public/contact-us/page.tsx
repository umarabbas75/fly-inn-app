"use client";

import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button, message } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
import NewsletterSection from "../../_components/newsletter-section";
import ReCAPTCHA from "react-google-recaptcha";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

const { TextArea } = Input;

const departmentOptions: SearchableSelectOption[] = [
  { label: "Sales", value: "Sales" },
  { label: "Careers", value: "Careers" },
  { label: "Disputes", value: "Disputes" },
  { label: "Help", value: "Help" },
  { label: "General", value: "General" },
];

// Validation schema
const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  department: yup.string().optional(),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

const ContactUsPage = () => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      department: "",
      subject: "",
      message: "",
    },
  });

  const onReCAPTCHAChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (!recaptchaToken) {
        message.error("Please complete the reCAPTCHA verification");
        return;
      }

      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          department: data.department,
          subject: data.subject,
          msg: data.message,
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      message.success("Message sent successfully! We'll get back to you soon.");
      reset();
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (error: any) {
      message.error(
        error.message || "Failed to send message. Please try again."
      );
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      title: "Mailing Address",
      content: "P.O. Box 270439, Fruitland, UT 84027",
    },
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: "Toll-Free",
      content: "833-I-Fly-Inn (833-435-9466)",
    },
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: "Phone",
      content: "321-I-Fly-Inn (321-435-9466)",
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      title: "Email",
      content: "PIC@Fly-Inn.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="app-container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600">
              We can't wait to hear from you! You SQUAWK, we WILCO 😃
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#AF2322]/10 rounded-full text-[#AF2322]">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours or Additional Info */}
              <div className="p-6 bg-gradient-to-br from-[#AF2322]/5 to-[#AF2322]/10 rounded-xl border border-[#AF2322]/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Why Contact Us?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#AF2322] mt-1">✓</span>
                    <span>General inquiries and questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AF2322] mt-1">✓</span>
                    <span>Support for bookings and listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AF2322] mt-1">✓</span>
                    <span>Partnership and business opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AF2322] mt-1">✓</span>
                    <span>Career inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AF2322] mt-1">✓</span>
                    <span>Feedback and suggestions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="John Doe"
                        status={errors.name ? "error" : ""}
                        className="rounded-lg"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        type="email"
                        placeholder="john@example.com"
                        status={errors.email ? "error" : ""}
                        className="rounded-lg"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Department Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <SearchableSelect
                        {...field}
                        value={value || undefined}
                        onValueChange={(val) => {
                          onChange(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : undefined
                          );
                        }}
                        options={departmentOptions}
                        placeholder="Choose one, if applicable"
                        showSearch={false}
                      />
                    )}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="How can we help you?"
                        status={errors.subject ? "error" : ""}
                        className="rounded-lg"
                      />
                    )}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        status={errors.message ? "error" : ""}
                        className="rounded-lg"
                      />
                    )}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef as any}
                    sitekey={
                      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
                    }
                    onChange={onReCAPTCHAChange}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isSubmitting}
                  disabled={!recaptchaToken}
                  icon={<SendOutlined className="text-white" />}
                  className="w-full h-12 text-white bg-[#AF2322] hover:!bg-[#8A1C1C] border-none font-semibold"
                  style={{ backgroundColor: "#AF2322" }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
