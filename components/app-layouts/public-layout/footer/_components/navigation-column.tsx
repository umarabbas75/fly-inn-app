import React from "react";
import Link from "next/link";

interface NavigationColumnProps {
  title: string;
  links: { label: string; href: string }[]; // Updated type to include href
}

const NavigationColumn: React.FC<NavigationColumnProps> = ({
  title,
  links,
}) => {
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold text-gray-800 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#AF2322]">
        {title}
      </h4>
      <ul className="space-y-3.5 pl-0">
        {links.map(
          (
            item,
            index // Changed 'link' to 'item' to destructure label and href
          ) => (
            <li key={index}>
              <Link
                href={item.href} // Use item.href for the link
                className="text-gray-600 hover:text-[#AF2322] transition-colors duration-300 flex items-start"
              >
                <span>{item.label}</span>{" "}
                {/* Use item.label for the displayed text */}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default NavigationColumn;
