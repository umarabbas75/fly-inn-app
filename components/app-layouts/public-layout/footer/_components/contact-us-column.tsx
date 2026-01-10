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
            P.O. Box 270439
            <br />
            Fruitland, UT 84027
          </span>
        </li>
        <li className="flex items-start">
          <PhoneOutlined className="mt-1 mr-3 text-[#AF2322]" />
          <div className="leading-relaxed">
            <div>
              <span className="font-semibold">Toll-Free: </span>
              <a
                href="tel:+18334359466"
                className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300"
              >
                833-I-Fly-Inn (833-435-9466)
              </a>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Phone: </span>
              <a
                href="tel:+13214359466"
                className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300"
              >
                321-I-Fly-Inn (321-435-9466)
              </a>
            </div>
          </div>
        </li>
        <li className="flex items-center">
          <MailOutlined className="mr-3 text-[#AF2322]" />
          <a
            href="mailto:PIC@Fly-Inn.com"
            className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300"
          >
            PIC@Fly-Inn.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactColumn;
