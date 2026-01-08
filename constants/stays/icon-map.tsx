import {
  FaParking,
  FaWifi,
  FaUtensils,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaTools,
  FaHome,
  FaFireExtinguisher,
  FaLaptop,
} from "react-icons/fa";
import {
  MdOutdoorGrill,
  MdDirectionsRun,
  MdLocalPharmacy,
  MdLocalHospital,
  MdKitchen,
  MdOutlineBedroomParent,
} from "react-icons/md";

export const iconMap = (heading: string) => {
  // Safety check for null/undefined heading
  if (!heading) return <FaHome className="text-gray-500 " />;

  const lowerHeading = heading.toLowerCase();

  if (lowerHeading.includes("wifi") || lowerHeading.includes("internet"))
    return <FaWifi className="text-gray-500 " />;
  if (lowerHeading.includes("parking"))
    return <FaParking className="text-gray-500 " />;
  if (lowerHeading.includes("kitchen"))
    return <MdKitchen className="text-gray-500 " />;
  if (lowerHeading.includes("dining"))
    return <FaUtensils className="text-gray-500 " />;
  if (lowerHeading.includes("safety"))
    return <FaShieldAlt className="text-gray-500 " />;
  if (lowerHeading.includes("hospital"))
    return <MdLocalHospital className="text-gray-500 " />;
  if (lowerHeading.includes("pharmacy"))
    return <MdLocalPharmacy className="text-gray-500 " />;
  if (lowerHeading.includes("outdoor"))
    return <MdOutdoorGrill className="text-gray-500 " />;
  if (lowerHeading.includes("runway") || lowerHeading.includes("landing"))
    return <MdDirectionsRun className="text-gray-500 " />;
  if (lowerHeading.includes("office") || lowerHeading.includes("work"))
    return <FaLaptop className="text-gray-500 " />;
  if (lowerHeading.includes("fire"))
    return <FaFireExtinguisher className="text-gray-500 " />;
  if (lowerHeading.includes("tools"))
    return <FaTools className="text-gray-500 " />;
  if (lowerHeading.includes("nearby"))
    return <FaMapMarkerAlt className="text-gray-500 " />;
  return <FaHome className="text-gray-500 " />;
};
