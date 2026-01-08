import React from "react";
import Link from "next/link";

const ContentCopyrightPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-container py-12">
        <div className="">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Content and Copyright Policy
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                All Member-submitted "Content", including, but not limited to,
                Listing titles, Listing descriptions, reviews, and the responses
                thereof, Guest and Host profiles, Squawks posts, and messages,
                whether it is text, audio, video, photographic, or photos of
                art, video, or photography, are the views and opinions of the
                Member who posted them, not FlyInn.
              </p>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Content that is allowed and/or expected:
              </h2>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    General
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Must be truthful, fair, accurate, and posted in the spirit
                      of creating greater good for the community
                    </li>
                    <li>
                      Must have the legal right or proper authorization to post
                      the Content
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Listings
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Titles and descriptions must be relevant to the Listing
                    </li>
                    <li>
                      Titles must only contain letters and the characters
                      visible on a standard keyboard
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Reviews
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Must reflect the Guest's or the Host's experience with the
                      transaction that took place between them
                    </li>
                    <li>
                      Must be honest, genuine, useful, relevant, and posted in
                      the spirit of creating greater good for the community
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Squawks
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Relevant content that stays on the topic being discussed
                      and either imparts or seeks knowledge
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Content that is not allowed:
              </h2>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Prohibited Content
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Any information that is false, misleading, or fraudulent
                  </li>
                  <li>Spam of any kind</li>
                  <li>
                    Advertising or hyperlinks to any website other than
                    fly-inn.com
                  </li>
                  <li>Impersonation of any kind</li>
                  <li>
                    Illegal Content or Content that violates another's rights
                  </li>
                  <li>Discrimination of any kind</li>
                  <li>
                    Bullying, harassing, discriminatory, or threatening Content
                  </li>
                  <li>Sexually explicit, violent, or graphic Content</li>
                  <li>Sharing anyone's private information</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Additional Information
              </h2>

              <p className="text-gray-700 mb-4">
                We explicitly disclaim any and all liability arising from the
                purported accuracy or legitimacy of any Content submitted by
                Members.
              </p>

              <p className="text-gray-700 mb-4">
                FlyInn reserves the right to remove any Content that we, at our
                sole discretion, determine to be in violation of our Terms of
                Service and Policies herein incorporated by reference.
              </p>

              <p className="text-gray-700 mb-6">
                FlyInn reserves the right to suspend or delete any account in
                violation, especially repeated violation of these provisions.
              </p>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Reporting Policy Violations
              </h2>

              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Should you become aware of any Content violations of our
                  Content and Copyright Policy, please contact us:
                </p>

                <p className="text-gray-700 mb-2">
                  <strong>General violations:</strong>{" "}
                  <Link
                    href="mailto:violations@fly-inn.com"
                    className="text-[#AF2322] hover:underline"
                  >
                    violations@fly-inn.com
                  </Link>
                </p>

                <p className="text-gray-700">
                  <strong>Copyright violations:</strong>{" "}
                  <Link
                    href="mailto:legal@fly-inn.com"
                    className="text-[#AF2322] hover:underline"
                  >
                    legal@fly-inn.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCopyrightPolicyPage;
