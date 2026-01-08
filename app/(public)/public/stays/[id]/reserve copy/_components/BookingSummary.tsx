import React from "react";
import { Card, Divider, Tag, Button } from "antd";
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";
import { Image } from "antd";

interface BookingSummaryProps {
  bookingData: any;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData }) => {
  const { stay, booking, pricing } = bookingData;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const calculateNights = () => {
    try {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 3; // Fallback to 3 nights
    }
  };

  const nights = calculateNights();
  const subtotal = nights * (booking.nightlyPrice || 0);
  const cleaningFee = stay.cleaning_fee ? parseFloat(stay.cleaning_fee) : 0;
  const taxRate = stay.tax_percentage
    ? parseFloat(stay.tax_percentage) / 100
    : 0;
  const taxAmount = (subtotal + cleaningFee) * taxRate;
  const total = subtotal + cleaningFee + taxAmount;

  // Fallback values for missing data
  const stayTitle = stay.title || "Beautiful Stay";
  const stayCity = stay.city || "City";
  const stayState = stay.state || "State";
  const stayLodgingType = stay.stay_type || "Property";
  const stayBedrooms = stay.no_of_bedrooms || 1;
  const stayBathrooms = stay.no_of_bathrooms || 1;
  const stayImage = stay.images?.[0]?.image || "/placeholder.jpg";

  return (
    <div className="space-y-6">
      {/* Stay Details Card */}
      <Card className="shadow-sm">
        <div className="flex items-start space-x-4">
          <Image
            src={stayImage}
            alt={stayTitle}
            width={120}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {stayTitle}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                {stayCity}, {stayState}
              </div>
              <div className="flex items-center">
                <FaStar className="mr-1 text-yellow-400" />
                5.0 (9 reviews)
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag color="blue">{stayLodgingType}</Tag>
              <Tag color="green">{stayBedrooms} bedrooms</Tag>
              <Tag color="orange">{stayBathrooms} bathrooms</Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* Trip Details Card */}
      <Card title="Trip Details" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-blue-500 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Check-in</p>
              <p className="text-gray-600">{formatDate(booking.checkIn)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-red-500 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Check-out</p>
              <p className="text-gray-600">{formatDate(booking.checkOut)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaUsers className="text-green-500 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Guests</p>
              <p className="text-gray-600">
                {booking.noOfAdults} adult{booking.noOfAdults !== 1 ? "s" : ""}
                {booking.noOfChildren > 0 &&
                  `, ${booking.noOfChildren} child${
                    booking.noOfChildren !== 1 ? "ren" : ""
                  }`}
                {booking.noOfInfants > 0 &&
                  `, ${booking.noOfInfants} infant${
                    booking.noOfInfants !== 1 ? "s" : ""
                  }`}
                {booking.noOfPets > 0 &&
                  `, ${booking.noOfPets} pet${
                    booking.noOfPets !== 1 ? "s" : ""
                  }`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-purple-500 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Duration</p>
              <p className="text-gray-600">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cancellation Policy Card */}
      <Card title="Cancellation Policy" className="shadow-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Free Cancellation</h4>
          <p className="text-sm text-blue-800">
            Cancel before {formatDate(booking.checkIn)} for a full refund.
            <Button type="link" className="p-0 h-auto text-blue-800 underline">
              View full policy
            </Button>
          </p>
        </div>
      </Card>

      {/* Price Breakdown Card */}
      <Card title="Price Details" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              ${booking.nightlyPrice || 0} × {nights} night
              {nights !== 1 ? "s" : ""}
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {cleaningFee > 0 && (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${cleaningFee.toFixed(2)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <Divider />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total (USD)</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingSummary;
