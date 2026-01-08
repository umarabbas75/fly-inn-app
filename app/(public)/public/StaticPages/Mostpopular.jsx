import React from "react";

const Mostpopular = () => {
  // This component can receive data through props or context
  // For now, using placeholder content since the original was expecting router state
  const state = {
    data: {
      sub_heading: "Most Popular Aviation Destinations",
      description: `
        <p>Discover the most sought-after aviation destinations across the country. 
        From scenic airparks to bustling fly-in communities, these locations offer 
        unique experiences for pilots and aviation enthusiasts alike.</p>
        
        <p>Whether you're looking for a weekend getaway or planning your next 
        cross-country flight, these popular destinations provide excellent facilities, 
        stunning views, and memorable experiences that keep pilots coming back.</p>
        
        <p>Each destination has been carefully selected based on pilot reviews, 
        amenities, accessibility, and the unique charm that makes it special to 
        the aviation community.</p>
      `,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-20">
        <section className="relative">
          <div className="app-container">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {state?.data?.sub_heading || "Most Popular"}
              </h2>
              <div className="text-sm text-[#AF2322] uppercase tracking-wider mb-2">
                who we are
              </div>
              <div className="w-20 h-1 bg-[#AF2322] mx-auto"></div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="prose prose-lg max-w-none">
                  {state?.data?.description ? (
                    <div
                      className="text-gray-700 leading-relaxed space-y-4 text-center"
                      dangerouslySetInnerHTML={{
                        __html: state.data.description,
                      }}
                    />
                  ) : (
                    <div className="text-gray-700 leading-relaxed space-y-4 text-center">
                      <p>
                        Discover the most sought-after aviation destinations
                        across the country. From scenic airparks to bustling
                        fly-in communities, these locations offer unique
                        experiences for pilots and aviation enthusiasts alike.
                      </p>

                      <p>
                        Whether you're looking for a weekend getaway or planning
                        your next cross-country flight, these popular
                        destinations provide excellent facilities, stunning
                        views, and memorable experiences that keep pilots coming
                        back.
                      </p>

                      <p>
                        Each destination has been carefully selected based on
                        pilot reviews, amenities, accessibility, and the unique
                        charm that makes it special to the aviation community.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gray-200 mt-12"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mostpopular;
