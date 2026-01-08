import React from "react";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const ContactColumn: React.FC = () => {
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold text-gray-800 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#AF2322]">
        Contact Us
      </h4>
      <ul className="space-y-4 text-gray-600">
        <li className="flex items-start">
          <EnvironmentOutlined className="mt-1 mr-3 text-[#AF2322]" />
          <span className="leading-relaxed">
            123 Aviation Way, Suite 456
            <br />
            Pilot City, PC 12345
          </span>
        </li>
        <li className="flex items-center">
          <PhoneOutlined className="mr-3 text-[#AF2322]" />
          <a
            href="tel:+15551234567"
            className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300"
          >
            +1 (555) 123-4567
          </a>
        </li>
        <li className="flex items-center">
          <MailOutlined className="mr-3 text-[#AF2322]" />
          <a
            href="mailto:info@fly-inn.com"
            className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300"
          >
            info@fly-inn.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactColumn;
