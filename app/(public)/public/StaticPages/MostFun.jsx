import React from "react";
import Link from "next/link";

const MostFun = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-20">
        <section className="relative">
          <div className="app-container">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                The Most Fun Fly-Ins in America
              </h2>
              <div className="text-sm text-[#AF2322] uppercase tracking-wider mb-2">
                Aviation Events
              </div>
              <div className="w-20 h-1 bg-[#AF2322] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Aircraft, Aviation Events, Aviation Industry, Aviation
                Interests, Cities, Fun Destinations, Searching and Booking,
                Travel Industry
              </p>
            </div>

            {/* Intro Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                    <img
                      src="/image/staticPage.webp"
                    className="w-full h-full object-cover"
                    alt="Fly-In Event"
                    />
                  </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      In order of popularity…
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                </div>
                  <p className="text-gray-700 leading-relaxed">
                      As we all know, fly-ins are opportunities for us pilots to
                    showcase our aircraft, attend workshops, connect with fellow
                    aviation enthusiasts, share our passion for flying, and just
                    have a groovy time! Here are some of the most fun fly-ins we
                    have attended in the United States:
                  </p>
                </div>
              </div>
            </div>

            {/* EAA AirVenture Oshkosh Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      EAA AirVenture Oshkosh
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Oshkosh, Wisconsin. Held annually in the summer. The next
                    one will take place on July 22-28, 2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    While it's considered the world's premier airshow, Oshkosh
                      is also a significant fly-in event. Thousands of aircraft
                      are tied down on the grounds for display. You will find
                    everything from homebuilts to vintage to contemporary models
                    when you arrive at Wittman Regional Airport and adjacent
                    Pioneer Airport. July 2023 OshKosh convention saw almost
                    700,000 people, making it hands down the largest aviation
                    celebration in the world.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    Among the attractions at OshKosh, the following stand out:
                    </p>
                  </div>
                <div className="shadow-xl rounded-lg overflow-hidden">
                    <img
                      src="/image/staticPage1.webp"
                    className="w-full h-full object-cover"
                    alt="EAA AirVenture Oshkosh"
                    />
                  </div>
                </div>
              </div>

            {/* Oshkosh Attractions Grid */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      AeroEducate Center
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      A free, self-paced online activity program for children
                      K-12 to explore how fun aviation can be. In addition to
                      daily forums from industry leaders and young
                      professionals, AeroEducate gives youth hands-on activities
                      to immerse them in the world of aviation.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Air Shows
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      See your favorite pilots perform daring feats of speed and
                      aerobatics all week long! Monday – Saturday daily from
                      2:30 pm to 6:30 pm, Sunday from 1:00 pm to 4:30 pm.
                      Nighttime shows on Wednesday and Saturday start at 8:00
                      pm.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Aircraft Areas
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Aircraft are divided into "neighborhoods" named after the
                      aircraft on display: Warbirds, Boeings, Home-builts,
                      Vintage, Aerobatic, Seaplane, Museum, and
                      Ultralight/LSA/Rotorcraft. Expect to see history,
                      innovation, craftsmanship, rarity, and uniqueness!
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Aircraft Rides
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Take a joyride on the Ford Tri-Motor 5-AT-B, the world's
                      first mass-produced airliner; the B-25 Berlin Express WWII
                      bomber; or the Bell 47 Helicopter made popular by M*A*S*H!
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Aviator's Club & Wing's Club
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Relax, cool down, and watch the air show from some of the
                      best seats in the house, right on the flightline!
                      Breakfast and lunch are served daily with dinner also
                      served for Wednesday and Saturday evening shows.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      EAA Aviation Museum
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Open all year, the museum is home to countless exhibits,
                      tours, and events. This is not to be missed while at
                      OshKosh!
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      EAA GirlVenture Camp
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      EAA seeks to show young women how to make their aviation
                      dreams a reality. For four days, young ladies are offered
                      hands-on activities and workshops, plus the opportunity to
                      hear speakers and meet special guests.
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      EAA Pilot Proficiency Center
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Using Master Flight Instructor Rich Stowell's "Nine
                      Principles of Light Aircraft Flying," the center offers a
                      one-of-a-kind educational experience for those who aspire
                      to improve their flying and/or teaching skills.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Fly-In Theater
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Bring a lawn chair or blanket and enjoy free popcorn while
                      watching Hollywood classics on a five-story-high
                      projection screen! Shows begin each evening at
                      approximately 8:30 pm.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      KidVenture
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Youth learn aviation history, how to fly a
                      radio-controlled airplane, and experience a B-25 simulated
                      flight! There are several aircraft-building activities
                      including riveting, engine work, and electronic
                      troubleshooting.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Runway 5K Run
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      This fun charity run/walk starts promptly at 7:00 am and
                      everyone is encouraged to participate. Travel through a
                      kaleidoscope of amazing aircraft while the community
                      cheers you on!
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Twilight Flight Fest
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Less traditional forms of aviation are displayed including
                      ultralights, powered parachutes, weight shift trikes,
                      homebuilt helicopters, and gyroplanes. Held Monday,
                      Tuesday, Thursday, and Friday evenings at 8:00 pm.
                    </p>
                    </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Workshops and Forums
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Learn about homebuilding, flying, repairing, restoring,
                      and maintaining aircraft through forums and hands-on
                      lessons in sheet metal, fabric, composite construction,
                      welding, and more.
                    </p>
                    </div>

                  <div className="bg-[#AF2322]/10 p-6 rounded-lg border border-[#AF2322]/20">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      <span className="font-bold text-[#AF2322]">
                        Admission:
                      </span>{" "}
                      Free for EAA (Experimental Aircraft Association) members
                      and tickets range from $12 to $15 for everyone else. For
                      more information, visit the EAA's AirVenture section of
                      their website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SUN 'n FUN Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static2.webp"
                    className="w-full h-full object-cover"
                    alt="SUN n FUN Aerospace Expo"
                  />
                  </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      SUN 'n FUN Aerospace Expo
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Lakeland, Florida. Held annually. The next one will take
                    place on April 9 – 14, 2024 (9:00 am to 6:00 pm daily, and
                    9:00 am - 10:00 pm on Wednesday and Saturday).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Much like Oshkosh, SUN 'n FUN is both an airshow and a major
                    fly-in event. There is so much to be enjoyed at Sun 'n Fun!
                  </p>
                </div>
              </div>
            </div>

            {/* Sun n Fun Attractions */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                Sun 'n Fun Highlights
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">
                    Aircraft Judging
                  </h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Categories include homebuilt, light, rotorcraft, seaplane,
                    ultralight, vintage and warbirds. Winners are awarded at the
                    on-site ceremony on Saturday evening.
                  </p>
                    </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">Airshows</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Masterful pilots perform amazing feats including aerobatics!
                    Plus, there's a mass balloon launch and the traditional
                    "Hare and Hound" race that everyone loves!
                  </p>
                    </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">Career Fair</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your General Admission ticket grants you entrance into this
                    five-day event. Exhibitors pre-schedule on-site meetings and
                    interviews!
                  </p>
                    </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">Flyin' Flix</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                      ACE plays an aviation-themed movie on their large, outdoor
                    screen every night of the week. Shows start at approximately
                    8:00 pm.
                  </p>
                    </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">
                    Kids' Activities
                  </h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Junior ACEs have an education area for kids ages 7-17 with
                    hands-on activities including building radios, carving
                    propellers, and designing digital airports.
                  </p>
                    </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h5 className="font-bold text-[#AF2322] mb-2">
                    Military Displays
                  </h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Come and see F-35A, F-35B, F-16, F-86, KC-135 demos as well
                    as performances by Baron, the SOCOM Jump Team and… The Blue
                    Angels!
                  </p>
                    </div>
                  </div>
                </div>

            {/* Triple Tree Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Triple Tree Aerodrome Fly-In
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Woodruff, South Carolina. Held annually at the end of
                    September. The next one will take place on September 23-29,
                    2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Triple Tree Fly-In is the fastest-growing aviation event in
                    the nation! Located in one of the most beautiful parts of
                    the country, Triple Tree's airport is known for its
                    immaculate 7,000-foot, grass runway.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                          Southern hospitality, fun, and camaraderie abound –
                    home-cooked meals are served daily! Throughout the week
                    there are special speakers, maintenance and restoration
                    workshops, karaoke, military history, HAM radio special
                    events, and more!
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The event takes place from Monday to Sunday. Premium camping
                    is available and includes water and power hookups.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For more information, visit the{" "}
                    <span className="font-bold text-[#AF2322]">
                      Triple Tree Aerodrome website
                    </span>
                    .
                        </p>
                      </div>
                <div className="shadow-xl rounded-lg overflow-hidden">
                        <img
                          src="/image/static3.webp"
                    className="w-full h-full object-cover"
                    alt="Triple Tree Aerodrome"
                        />
                </div>
                      </div>
                    </div>

            {/* AOPA Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                            <img
                              src="/image/static4.webp"
                    className="w-full h-full object-cover"
                    alt="AOPA Fly-In"
                            />
                          </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      AOPA Fly-Ins
                              </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                            </div>
                  <p className="text-gray-700 leading-relaxed">
                    AOPA hosts several regional fly-ins each year across the
                    country, offering seminars, aircraft displays, and
                    networking opportunities.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Buckeye, Arizona. AOPA Fly-In at the Buckeye Air Fair is
                    held annually at the Buckeye Municipal Airport (KBXK). The
                    next one will take place on February 16-18, 2024.
                  </p>

                  <div className="mt-6 space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      <span className="font-bold text-[#AF2322]">
                        Exhibitors:
                      </span>{" "}
                      Visit all the numerous Air Fair booths on site! Come and
                      look for us at Fly-Inn's booth, pick up some free swag,
                      and say "hello!"
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="font-bold text-[#AF2322]">
                        Seminars:
                      </span>{" "}
                      Learn from leading experts in the industry about aviation
                      safety and many other topics in AOPA's spacious indoor
                      Exhibit Hall.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="font-bold text-[#AF2322]">
                        Aircraft on Display:
                      </span>{" "}
                        Visit their colossal aircraft display (insiders told us
                      there will be 500 aircraft on display!)
                      </p>
                    </div>
                  </div>
                      </div>
                    </div>

            {/* B-17 Gathering Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static5.webp"
                    className="w-full h-full object-cover"
                    alt="B-17 Gathering"
                  />
                      </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      B-17 Gathering & Big Bird Fly-In (RC)
                      </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Monaville, Texas. Held annually. Dates for the next one have
                    not yet been announced.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If you love RC, this annual fly-in, hosted by the Academy of
                    Model Aeronautics, is for you. It is held in Bomber Field,
                    USA, which was built for everyone's enjoyment by BB Weber, a
                    long-time RC lover.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Small and with a family feel, this fly-in focuses on
                    warbirds, especially B-17s, and other large aircraft. They
                    have awards for Best Electric, Best Pre-WWII, Best WWII,
                    Best Jet, Best Multi-Engine, Best B-17, and Best of Show.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    "Bomber Burgers" are cooked fresh daily. For the pilots,
                    they even have a free lunch consisting of an 8-foot pizza to
                    stay true to the large-scale theme!
                    </p>
                  </div>
                </div>
              </div>

            {/* Texas Antique Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Texas Antique Airplane Association Fly-In
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Gainesville, Texas. Held annually. The next one will take
                    place on September 20 and 21, 2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Since its inception in 1962, the Fall Festival of Flight has
                    been drawing fans of the aircraft of yesteryear and
                      affording them the opportunity to see the planes and meet
                    the pilots who whole-heartedly keep them.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                      Participating airplanes are Antiques, Classics, Warbirds,
                    Replicas, and Homebuilts. Award categories include Grand
                    Champion, Best Antique (before 1942), Best Classic
                    (1942-1955), Best Neo-Classic (1956-1970), Best War Bird,
                    Best Home Built, and Youngest Pilot in Command.
                    </p>
                  </div>
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static6.webp"
                    className="w-full h-full object-cover"
                    alt="Texas Antique Airplane Association"
                  />
                </div>
                  </div>
                </div>

            {/* West Coast Piper Cub Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static7.webp"
                    className="w-full h-full object-cover"
                    alt="West Coast Piper Cub Fly-In"
                  />
                    </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      West Coast Piper Cub Fly-In
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Lompoc, California. Held annually each summer. The next one
                    will take place on July 12-14, 2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                      As the name suggests, this fly-in event centers around the
                      beloved Piper Cub and similar aircraft. The West Coast Cub
                    Fly-in has been a fun, family-friendly aviation event at the
                    Lompoc Airport since 1984.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The event draws in many Lockhaven-yellow Piper Cubs, vintage
                    biplanes, and aviation enthusiasts from all around. The
                    fly-in is free for spectators and all are welcome to attend,
                    view aircraft, speak with pilots, and watch flying events
                    including spot landing and flour drop contests!
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm italic">
                    Fun fact: Piper Aircraft manufactured the model between 1937
                    and 1947 for use in WWII and it has become Piper's
                    most-produced model since then.
                    </p>
                  </div>
                </div>
              </div>

            {/* Valdez STOL Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Valdez STOL Fly-In
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Valdez, Alaska. Held annually. The next one will take place
                    on May 10-12, 2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                      The Valdez Fly-In & Air Show is the ultimate bush plane
                    fly-in in the United States! The three-day event takes place
                    in May each year. Pioneer Field, Valdez Airport (KVDZ), is
                    nestled amidst the Chugach Mountains, near the top of a
                    profound fjord in Prince William Sound.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The main attraction is the world-famous competition for
                    short takeoff and landing (STOL). In 2018, Fred Knapp set
                    the Valdez record by lifting his Piper Cub off the ground in
                    just 11 feet! Dan Reynolds set a landing record of 9.5 feet!
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Other favorites include aerobatic performances, balloon bust
                    competition, flour bombing, pilot round tables, beach
                    landing fly-outs, and static aircraft displays.
                    </p>
                  </div>
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static8.webp"
                    className="w-full h-full object-cover"
                    alt="Valdez STOL Fly-In"
                  />
                </div>
                  </div>
                </div>

            {/* RAF Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                  <img
                    src="/image/static9.webp"
                    className="w-full h-full object-cover"
                    alt="RAF Backcountry Fly-Ins"
                  />
              </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Recreational Aviation Foundation (RAF) Backcountry Fly-Ins
                      </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    RAF's mission statement is, "Recreational Aviation
                      Foundation preserves, improves, and creates airstrips for
                    recreational access."
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    True to its name, RAF hosts various fly-ins throughout the
                    year in scenic, backcountry airstrips, celebrating the joys
                    of bush flying and promoting the preservation of such
                    airstrips.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Too many fly-ins to list, so do check out RAF's events
                      calendar.
                    </p>
                  </div>
                </div>
              </div>

            {/* International Seaplane Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      The International Seaplane Fly-In
                    </h3>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-[#AF2322]">Location:</span>{" "}
                    Greenville, Maine. Held annually in September, the weekend
                    after Labor Day. The next one will take place on September
                    5-8, 2024.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Since 1973, the four-day event has drawn thousands of people
                    to the area every year to enjoy the quaint surrounding
                    towns, the beauty of autumnal Maine, and the spectacular
                    aviation event on the southern shore of Moosehead Lake.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Spectators admire hundreds of low fly-bys performed by rare,
                    classic, and experimental planes. There's also live music,
                    an outdoor market, seaplane competitions including spot
                    landings, short field takeoffs, water bombings, and the
                    float plane parade right on the water!
                  </p>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    The Fly-In will be celebrating its 50th event in 2024. We're
                    not missing it, so we'll see you there!
                    </p>
                  </div>
                <div className="shadow-xl rounded-lg overflow-hidden">
                    <img
                      src="/image/static10.webp"
                    className="w-full h-full object-cover"
                    alt="International Seaplane Fly-In"
                    />
                  </div>
                </div>
              </div>

            {/* Closing Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="shadow-xl rounded-lg overflow-hidden">
                    <img
                      src="/image/static11.webp"
                    className="w-full h-full object-cover"
                    alt="SUN n FUN Florida"
                    />
                  </div>
                <div className="space-y-4">
                  <div className="mb-6">
                    <p className="text-gray-600 italic mb-2">
                      SUN 'n FUN, Florida.
                    </p>
                    <div className="w-16 h-1 bg-[#AF2322] mt-4"></div>
                </div>
                  <p className="text-gray-700 leading-relaxed">
                      These are just a handful of the many fly-ins that occur
                      throughout the United States. Each offers such a unique
                    atmosphere and experience, that we really try to make it to
                    as many as we can each year.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Will we see you at the next one? We surely hope so! Look for
                    our information desk or just see us walking around wearing
                    our hard-to-miss shirts.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    Did we miss one of your favorite fly-ins? Write us a comment
                    and share which one you would like to see added here!
                    </p>
                  </div>
                </div>
              </div>

            {/* Separator */}
            <div className="w-full h-px bg-gray-200 my-12"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MostFun;
