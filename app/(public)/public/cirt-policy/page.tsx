import React from "react";
import Image from "next/image";

const CirtPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-container py-12">
        <div className="">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">CIRT Policy</h1>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                CIRTainly
              </h2>

              <p className="text-gray-700 italic mb-6">
                "Without integrity, nothing works."
              </p>

              <p className="text-gray-700 mb-4">
                While it is unclear who exactly came up with the phrase above,
                Werner Erhard, Professor Michael Jensen, or Steve Zaffron, it is
                the motto we live by at FlyInn. That and something more…
              </p>

              <p className="text-gray-700 mb-4 font-semibold">
                We would rephrase it to, "Without Common Sense, Integrity,
                Respect, and Trust, Nothing Works."
              </p>

              <p className="text-gray-700 mb-4">
                It takes common sense to come up with the rules that make our
                Community thrive. It takes integrity to stand behind those rules
                and follow them. Common sense and integrity are the keys to
                building a solid foundation of Respect among Members, a Respect
                that people can count on and Trust.
              </p>

              <p className="text-gray-700 mb-4">
                We are a stand for creating this to be your Community, a
                Community where every one of you feels like a very important
                Member. Being able to count on that level of integrity and
                respect for the rules, guidelines, standards, and policies that
                FlyInn establishes by listening to its Members is what makes our
                Community and marketplace thrive.
              </p>

              <p className="text-gray-700 mb-8">
                We encourage you to be an active Member of your Community by
                sharing your opinions, feedback, and suggestions in the spirit
                of making the Community better.
              </p>

              <div className="my-8 flex justify-center">
                <img
                  src="/images/static-pages/11-cirt-scaled.jpg"
                  alt="CIRT - Common Sense, Integrity, Respect, Trust"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Our Core Values
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <span className="text-[#AF2322] font-bold mr-2">C</span>
                    <div>
                      <span className="font-semibold">Common Sense:</span>
                      <span className="text-gray-600 ml-2">
                        Practical judgment in our community
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#AF2322] font-bold mr-2">I</span>
                    <div>
                      <span className="font-semibold">Integrity:</span>
                      <span className="text-gray-600 ml-2">
                        Standing behind our commitments
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#AF2322] font-bold mr-2">R</span>
                    <div>
                      <span className="font-semibold">Respect:</span>
                      <span className="text-gray-600 ml-2">
                        Valuing every member equally
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#AF2322] font-bold mr-2">T</span>
                    <div>
                      <span className="font-semibold">Trust:</span>
                      <span className="text-gray-600 ml-2">
                        Building reliable relationships
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CirtPolicyPage;
