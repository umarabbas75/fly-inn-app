import React from "react";
import Link from "next/link";

const CopyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12">
        <div className="app-container">
          {/* Breadcrumb and Title */}
          <div className="mb-8">
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-[#AF2322] hover:underline">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">
                  <span className="mx-2">/</span>
                </li>
                <li className="text-gray-700">Content and Copyright Policy</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800">
              Content and Copyright Policy
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  All Member-submitted "Content", including, but not limited to,
                  Listing titles, Listing descriptions, reviews, and the
                  responses thereof, Guest and Host profiles, Squawks posts, and
                  messages, whether it is text, audio, video, photographic, or
                  photos of art, video, or photography, are the views and
                  opinions of the Member who posted them, not FlyInn.
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  We reserve the right to remove any Member-submitted Content
                  for any reason, including, in our sole discretion, lack of
                  adherence to the guidelines outlined in our Terms of Service,
                  our CIRTainly Policy, or this policy. By posting your Content
                  on Fly-Inn, you are asserting that you agree to adhere to
                  these Terms and Policies.
                </p>

                {/* Allowed Content Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">
                  Content that is allowed and/or expected:
                </h2>

                <ol className="list-decimal pl-6 space-y-4 text-gray-700">
                  <li>
                    <span className="font-semibold">General</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Must be truthful, fair, accurate, and posted in the
                        spirit of creating greater good for the community
                      </li>
                      <li>
                        Must have the legal right or proper authorization to
                        post the Content
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Listings</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Titles and descriptions must be relevant to the Listing
                      </li>
                      <li>
                        Titles must only contain letters and the characters
                        visible on a standard keyboard, without using such
                        characters to create text emojis
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Reviews</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Must reflect the Guest's or the Host's experience with
                        the transaction that took place between them.
                      </li>
                      <li>
                        Must be honest, genuine, useful, relevant, and posted in
                        the spirit of creating greater good for the community,
                        for example, to sincerely and kindly educate the person
                        whom you are addressing, or to congratulate. Such
                        communication edifies the receiver and informs the
                        community thereby enabling them to make educated choices
                        when it comes to choosing which Hosts or Guests to do
                        business with on the Platform
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Squawks</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Relevant content that stays on the topic being discussed
                        and either imparts or seeks knowledge
                      </li>
                    </ol>
                  </li>
                </ol>

                {/* Not Allowed Content Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">
                  Content that is not allowed:
                </h2>

                <ol className="list-decimal pl-6 space-y-4 text-gray-700">
                  <li>
                    <span className="font-semibold">General</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Any information that is false, misleading, or
                        fraudulent, especially true of profiles and Listings
                      </li>
                      <li>Spam of any kind</li>
                      <li>
                        Advertising of any kind including, but not limited to,
                        business names, logos, slogans, or hyperlinks to any
                        website other than fly-inn.com
                      </li>
                      <li>Impersonation of any kind</li>
                      <li>
                        Illegal Content or Content that violates another's
                        rights, including intellectual property rights
                      </li>
                      <li>Discrimination of any kind</li>
                      <li>
                        Bullying, harassing, discriminatory, or threatening
                        Content
                      </li>
                      <li>Sexually explicit, violent, or graphic Content</li>
                      <li>
                        Sharing anyone's private information explicitly or
                        sharing enough information that someone can find the
                        private information
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Listings</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Fraudulent, false, or misleading information, especially
                        material information
                      </li>
                      <li>
                        Giving any clues as to the address or location of a
                        Listing, including displaying the house number in the
                        photography
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Reviews</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>
                        Disclosing the address or location of a Listing whether
                        it be in the review itself or the responses to the
                        reviews
                      </li>
                      <li>
                        Coercing the other party to pay amounts owed via a
                        review
                      </li>
                      <li>
                        Coercing the other party to leave a positive review
                      </li>
                      <li>
                        Reviewing a property that you own, manage, or are
                        somehow affiliated with
                      </li>
                      <li>Reviewing a property that you compete with</li>
                      <li>Misleading, deceitful reviews</li>
                      <li>
                        Threatening the other party if they leave a negative
                        review
                      </li>
                      <li>Reviewing a Property you have never stayed in</li>
                      <li>
                        Purchasing a review for any valuable consideration
                      </li>
                      <li>
                        Reviewing a property you have stayed in outside of 14
                        days after your stay
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="font-semibold">Squawks</span>
                    <ol className="list-lower-alpha pl-6 mt-2 space-y-2">
                      <li>Bullying, harassment, or disrespect of any kind</li>
                      <li>
                        Irrelevant Content that strays off the topic being
                        discussed and neither imparts nor seeks knowledge
                      </li>
                    </ol>
                  </li>
                </ol>

                {/* Additional Information Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">
                  Additional Information
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    We explicitly disclaim any and all liability arising from
                    the purported accuracy or legitimacy of any Content
                    submitted by Members.
                  </p>

                  <p className="leading-relaxed">
                    FlyInn reserves the right to remove any Content that we, at
                    our sole discretion, determine to be in violation of our
                    Terms of Service and Policies herein incorporated by
                    reference.
                  </p>

                  <p className="leading-relaxed">
                    FlyInn reserves the right to suspend or delete any account
                    in violation, especially repeated violation of these
                    provisions.
                  </p>

                  <p className="leading-relaxed">
                    If you would like to remove a review that you wrote, send us
                    an email to{" "}
                    <Link
                      href="mailto:help@fly-inn.com"
                      className="text-[#AF2322] hover:underline"
                    >
                      help@fly-inn.com
                    </Link>{" "}
                    requesting it be removed. You must include the Listing's URL
                    and the URL for your profile and a brief statement asking us
                    to remove it. Please note that we can only remove reviews,
                    we cannot edit them.
                  </p>
                </div>

                {/* Reporting Violations Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">
                  Reporting Policy Violations
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    Should you become aware of any Content violations of our
                    Content and Copyright Policy, please contact us by sending
                    us an email to{" "}
                    <Link
                      href="mailto:violations@fly-inn.com"
                      className="text-[#AF2322] hover:underline"
                    >
                      violations@fly-inn.com
                    </Link>
                    . Please include as much information as possible.
                  </p>

                  <p className="leading-relaxed">
                    If you become aware of a violation that is specifically a
                    Copyright violation, please email us at{" "}
                    <Link
                      href="mailto:legal@fly-inn.com"
                      className="text-[#AF2322] hover:underline"
                    >
                      legal@fly-inn.com
                    </Link>
                    . Our legal team will be in touch promptly to inform you of
                    the next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CopyPolicy;
