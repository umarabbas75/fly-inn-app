import { FaBed, FaUser } from "react-icons/fa";

interface Bedroom {
  id: number;
  name: string;
  no_of_guest: number;
  no_of_beds: number;
  bed_type: string;
}

interface BedroomSectionProps {
  bedrooms?: Bedroom[];
}

const BedroomSection = ({ bedrooms = [] }: BedroomSectionProps) => {
  if (!bedrooms || bedrooms.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
        Bedroom Details
      </h2>

      {/* Screen version - with cards and icons */}
      <div className="screen-only">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bedrooms.map((room) => (
            <div
              key={room.id}
              className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-base font-medium text-gray-700 mb-4 tracking-tight">
                {room.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500 text-base" />
                  <span>
                    {room.no_of_guest} {room.no_of_guest === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBed className="text-gray-500 text-base" />
                  <span>
                    {room.no_of_beds}{" "}
                    {room.bed_type.charAt(0).toUpperCase() + room.bed_type.slice(1).toLowerCase()}{" "}
                    {room.no_of_beds > 1 ? "Beds" : "Bed"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print version - plain text list */}
      <div className="print-only">
        <div className="text-sm">
          {bedrooms.map((room, index) => (
            <span key={room.id}>
              <strong>{room.name}:</strong> {room.no_of_guest} guest{room.no_of_guest !== 1 ? "s" : ""}, {room.no_of_beds} {room.bed_type} bed{room.no_of_beds !== 1 ? "s" : ""}
              {index < bedrooms.length - 1 ? " | " : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BedroomSection;
