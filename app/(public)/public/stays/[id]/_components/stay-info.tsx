import {
  FaUserFriends,
  FaBed,
  FaBath,
  FaDoorOpen,
  FaRulerCombined,
  FaCalendarCheck,
  FaCalendarTimes,
  FaDog,
  FaBroom,
  FaDollarSign,
  FaBuilding,
  FaHome,
  FaCalendarWeek,
  FaCalendarAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { MdBedroomParent } from "react-icons/md";
import { GiBunkBeds } from "react-icons/gi";
import { lodgingType } from "@/constants/stays";

// Helper to get lodging type label from value
const getLodgingTypeLabel = (value: string | undefined): string => {
  if (!value) return "N/A";
  const found = lodgingType.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  return found ? found.label : value;
};

// Lodging types that show floor number
const FLOOR_NUMBER_LODGING_TYPES = [
  "hotel_room",
  "apt_condo_loft",
  "bed_breakfast",
];

const DetailCard = ({ icon: Icon, title, value }: any) => (
  <div className="flex flex-col items-center border-gray-200 justify-center border rounded-2xl p-4 min-w-[130px] shadow-sm hover:shadow-md hover:bg-gray-100 transition">
    <Icon className="text-2xl text-gray-800 mb-1" />
    <p className="text-sm font-medium text-gray-500 text-center">{title}</p>
    <p className="text-sm font-semibold text-afPrimary mt-1 text-center">
      {value}
    </p>
  </div>
);

interface StayInfoProps {
  listing?: {
    type_of_space?: string;
    lodging_type?: string;
    no_of_guest?: number;
    no_of_bedrooms?: number;
    no_of_beds?: number;
    no_of_bathrooms?: string | number;
    no_of_rooms?: number;
    size?: number;
    unit_of_measure?: string;
    floor_number?: string | number;
    instant_booking?: number | boolean;
    nightly_price?: string | number;
    apply_weekend_price?: string;
    weekend_nightly_price?: string | number | null;
    nightly_price_seven_plus?: string | number;
    nightly_price_thirty_plus?: string | number;
    additional_guest?: number | boolean;
    no_of_additional_guest?: number | null;
    additional_guest_price?: string | number | null;
    pet_allowed?: number | boolean;
    no_of_pets?: number | null;
    max_pets?: number | null;
    price_per_pet?: string | number | null;
    cleaning_fee?: string | number;
    city_fee?: string | number | null;
    tax_percentage?: string | number;
    min_day_booking?: number;
    max_day_booking?: number;
    check_in_after?: string;
    check_out_before?: string;
  };
}

const StayInfo = ({ listing }: StayInfoProps) => {
  const data = listing || {};

  return (
    <div className="space-y-8">
      {/* Screen version with icons */}
      <div className="screen-only">
        <section>
          <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
            Property Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            <DetailCard
              icon={FaUserFriends}
              title="Guests"
              value={data.no_of_guest || 0}
            />
            <DetailCard
              icon={MdBedroomParent}
              title="Bedrooms"
              value={data.no_of_bedrooms || 0}
            />
            <DetailCard
              icon={GiBunkBeds}
              title="Beds"
              value={data.no_of_beds || 0}
            />
            <DetailCard
              icon={FaBath}
              title="Bathrooms"
              value={
                data.no_of_bathrooms
                  ? parseFloat(String(data.no_of_bathrooms)).toFixed(1)
                  : "0"
              }
            />
            <DetailCard
              icon={FaDoorOpen}
              title="Rooms"
              value={data.no_of_rooms || 0}
            />
            <DetailCard
              icon={FaCalendarCheck}
              title="Check-in Time"
              value={data.check_in_after || "N/A"}
            />
            <DetailCard
              icon={FaCalendarTimes}
              title="Check-out Time"
              value={data.check_out_before || "N/A"}
            />
            <DetailCard
              icon={FaHome}
              title="Dwelling Type"
              value={getLodgingTypeLabel(
                data.lodging_type || data.type_of_space
              )}
            />
            {FLOOR_NUMBER_LODGING_TYPES.includes(data.lodging_type || "") && (
              <DetailCard
                icon={FaLayerGroup}
                title="Floor Number"
                value={data.floor_number || "N/A"}
              />
            )}
            <DetailCard
              icon={FaRulerCombined}
              title="Size"
              value={
                data.size && data.unit_of_measure
                  ? `${data.size} ${data.unit_of_measure}`
                  : "N/A"
              }
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
            Price Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            <DetailCard
              icon={FaDollarSign}
              title="Per Night"
              value={
                data.nightly_price
                  ? `$${parseFloat(String(data.nightly_price)).toFixed(2)}`
                  : "N/A"
              }
            />
            <DetailCard
              icon={FaCalendarWeek}
              title="Weekly Rate"
              value={
                data.nightly_price_seven_plus
                  ? `$${parseFloat(
                      String(data.nightly_price_seven_plus)
                    ).toFixed(2)}/night`
                  : "N/A"
              }
            />
            <DetailCard
              icon={FaCalendarAlt}
              title="Monthly Rate"
              value={
                data.nightly_price_thirty_plus
                  ? `$${parseFloat(
                      String(data.nightly_price_thirty_plus)
                    ).toFixed(2)}/night`
                  : "N/A"
              }
            />
            {data.additional_guest && data.additional_guest_price && (
              <DetailCard
                icon={FaUserFriends}
                title={
                  data.no_of_additional_guest
                    ? `Additional Guest (up to ${data.no_of_additional_guest})`
                    : "Additional Guest"
                }
                value={`$${parseFloat(
                  String(data.additional_guest_price || 0)
                ).toFixed(2)}/guest/night`}
              />
            )}
            <DetailCard
              icon={FaDog}
              title={
                data.no_of_pets || data.max_pets
                  ? `Pets (up to ${data.no_of_pets || data.max_pets})`
                  : "Pets"
              }
              value={
                data.pet_allowed
                  ? `$${parseFloat(String(data.price_per_pet || 0)).toFixed(
                      2
                    )}/pet/night`
                  : "No"
              }
            />
            <DetailCard
              icon={FaBroom}
              title="Cleaning Fee"
              value={
                data.cleaning_fee
                  ? `$${parseFloat(String(data.cleaning_fee)).toFixed(2)}`
                  : "N/A"
              }
            />
          </div>
        </section>
      </div>

      {/* Print version - text-based table */}
      <div className="print-only">
        <section>
          <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
            Property Details
          </h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
            <div>
              <strong>Guests:</strong> {data.no_of_guest || 0}
            </div>
            <div>
              <strong>Bedrooms:</strong> {data.no_of_bedrooms || 0}
            </div>
            <div>
              <strong>Beds:</strong> {data.no_of_beds || 0}
            </div>
            <div>
              <strong>Bathrooms:</strong>{" "}
              {data.no_of_bathrooms
                ? parseFloat(String(data.no_of_bathrooms)).toFixed(1)
                : "0"}
            </div>
            <div>
              <strong>Rooms:</strong> {data.no_of_rooms || 0}
            </div>
            <div>
              <strong>Check-in:</strong> {data.check_in_after || "N/A"}
            </div>
            <div>
              <strong>Check-out:</strong> {data.check_out_before || "N/A"}
            </div>
            <div>
              <strong>Type:</strong>{" "}
              {getLodgingTypeLabel(data.lodging_type || data.type_of_space)}
            </div>
            {FLOOR_NUMBER_LODGING_TYPES.includes(data.lodging_type || "") && (
              <div>
                <strong>Floor:</strong> {data.floor_number || "N/A"}
              </div>
            )}
            <div>
              <strong>Size:</strong>{" "}
              {data.size && data.unit_of_measure
                ? `${data.size} ${data.unit_of_measure}`
                : "N/A"}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
            Price Details
          </h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
            <div>
              <strong>Per Night:</strong>{" "}
              {data.nightly_price
                ? `$${parseFloat(String(data.nightly_price)).toFixed(2)}`
                : "N/A"}
            </div>
            <div>
              <strong>Weekly Rate:</strong>{" "}
              {data.nightly_price_seven_plus
                ? `$${parseFloat(String(data.nightly_price_seven_plus)).toFixed(
                    2
                  )}/night`
                : "N/A"}
            </div>
            <div>
              <strong>Monthly Rate:</strong>{" "}
              {data.nightly_price_thirty_plus
                ? `$${parseFloat(
                    String(data.nightly_price_thirty_plus)
                  ).toFixed(2)}/night`
                : "N/A"}
            </div>
            <div>
              <strong>Additional Guests:</strong>{" "}
              {data.additional_guest
                ? `$${parseFloat(
                    String(data.additional_guest_price || 0)
                  ).toFixed(2)}/guest/night`
                : "No"}
            </div>
            <div>
              <strong>
                Pets
                {data.no_of_pets || data.max_pets
                  ? ` (up to ${data.no_of_pets || data.max_pets})`
                  : ""}
                :
              </strong>{" "}
              {data.pet_allowed
                ? `$${parseFloat(String(data.price_per_pet || 0)).toFixed(
                    2
                  )}/pet/night`
                : "No"}
            </div>
            <div>
              <strong>Cleaning Fee:</strong>{" "}
              {data.cleaning_fee
                ? `$${parseFloat(String(data.cleaning_fee)).toFixed(2)}`
                : "N/A"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StayInfo;
