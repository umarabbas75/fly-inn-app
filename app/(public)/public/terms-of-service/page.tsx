"use client";

import React from "react";
import Link from "next/link";

const TermService = () => {
  const PRIMARY_COLOR = "text-[#af2322]";
  const LINK_COLOR_CLASS = PRIMARY_COLOR;

  // Helper function to handle both internal (with /public/) and external links
  const CustomLink = ({ to, children }: any) => {
    const isExternal = to.startsWith("http") || to.startsWith("mailto:");

    // Map old paths to new corrected paths
    const pathMapping: { [key: string]: string } = {
      "/privacy_policy": "/privacy-policy",
      "/copy_right": "/content-copyright-policy",
      "/Off-the-Platform-Fees-Policy": "/off-the-platform-fees-policy",
      "/Neighborhood-Nuisance-and-Disruptive-Behavior-Policy":
        "/neighborhood-nuisance-policy",
      "/Service-Fees-Policy": "/service-fees-policy",
      "/cirt-policy": "/cirt-policy",
      "/fair-housing-policy": "/fair-housing-policy",
      "/trademark-policy": "/trademark-policy",
      "/terms-of-service": "/terms-of-service",
      "/short-term-rental-insurance": "/short-term-rental-insurance",
      "/": "/",
    };

    // Map the path if it exists in our mapping, otherwise use the original
    const mappedPath = pathMapping[to] || to;
    const finalHref = isExternal ? to : `/public${mappedPath}`;

    if (isExternal) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:underline ${LINK_COLOR_CLASS}`}
        >
          {children}
        </a>
      );
    }

    // Use Next.js Link component for internal navigation
    return (
      <Link href={finalHref} className={`hover:underline ${LINK_COLOR_CLASS}`}>
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2] py-16 md:py-20">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#AF2322]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 app-container">
          <div className="mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-[#AF2322]/10 text-[#AF2322] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
              Legal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">Last Updated: February 5, 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="app-container">
          <div className=" mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  WELCOME
                </h2>
                <p>
                  Welcome to Fly-Inn! Fly-Inn is our own little heaven on earth,
                  a place where we can come together as <strong>Hosts</strong>{" "}
                  and <strong>Guests</strong> and make it easy to enjoy a
                  marvelous time with our loved ones. We offer a
                  <strong>Platform</strong> that connects Hosts who have{" "}
                  <strong>Rental Properties</strong> and transportation to rent,
                  with Guests seeking to rent from them.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ACCEPTANCE OF TERMS
                </h2>
                <p>
                  These{" "}
                  <CustomLink to="/terms-of-service">
                    Terms of Service
                  </CustomLink>
                  , as well as our&nbsp;
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>,
                  which is incorporated by reference (collectively, the “
                  <strong>Terms</strong>”), govern your use or access of
                  Fly-Inn.com, any subdomains thereof, and the other products,
                  services, features, mobile applications, technologies, and
                  software we offer (collectively, the “
                  <strong>Platform</strong>”). These Terms are posted on
                  the&nbsp;
                  <a
                    href={"/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline ${LINK_COLOR_CLASS}`}
                  >
                    {" "}
                    Platform{" "}
                  </a>
                  . Read through all of the Terms carefully. These Terms are a
                  legally binding agreement between you and FlyInn, LLC.{" "}
                  <strong>
                    PLEASE READ THEM CAREFULLY. BY USING OR ACCESSING THE
                    PLATFORM, YOU FULLY AGREE TO THESE TERMS; IF YOU DO NOT
                    FULLY AGREE, DO NOT ACCESS OR USE THE PLATFORM.
                  </strong>
                </p>
                <p>
                  FlyInn, LLC, including our employees, affiliates, agents,
                  licensees, and successors (“FlyInn”) is referred to herein as
                  “ <strong>FlyInn</strong>,” “<strong>we</strong>,” “
                  <strong>us</strong>” or “ <strong>our</strong>”. Those
                  accessing or using the Platform, whether to visit, browse
                  information, properties or services, offer a property for
                  rent, offer a service, request to book a property or service,
                  book a property or service, or otherwise, registered or
                  unregistered with the Platform, are referred to herein as “
                  <strong>User</strong>,” “<strong>they</strong>,” “
                  <strong>them</strong>,” or “<strong>their</strong>.” and
                  Users, if registered with the Platform, are hereby
                  specifically referred to as a “<strong>Member</strong>” “
                  <strong>you</strong>,” or “<strong>your</strong>.” When a
                  Member offers a Rental Property, Goods or Services, that
                  Member is referred to herein as “ <strong>Host</strong>.” When
                  a Member browses, requests to book, or books a property or
                  service, that Member is referred to herein as “
                  <strong>Guest</strong> .” Anything a Host offers is known as
                  an “ <strong>Offering</strong>,” and Offerings published on
                  the Platform are referred to herein as a “{" "}
                  <strong>Listing</strong> .” When a Host offers real property
                  for rent, that property is referred to herein as “{" "}
                  <strong>Rental Property</strong>.” Host Offerings of tangible
                  products for consumption, for example, pre-packaged food, are
                  referred to herein as “<strong>Goods</strong>.” Host offerings
                  of services or tangible products for temporary use, for
                  example, rental of cars and aircraft, are referred to herein
                  as “<strong>Services</strong> .” When the term “will” is
                  employed in these Terms, it signifies an obligation with the
                  same significance as “shall.”
                </p>
                <p>
                  (Section headings found in these Terms are for your
                  convenience only and do not constrain the scope or extent of
                  the respective section.)
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  TABLE OF CONTENTS
                </h2>
                <div className="leading-relaxed">
                  <p>
                    Welcome
                    <br />
                    Acceptance Of Terms
                    <br />
                    Modification Of Terms
                    <br />
                    Member Eligibility, Account Registration, And Identity
                    Verification
                    <br />
                    Flyinn’s Role, Members’ Responsibility, Conduct, And Use
                    <br />
                    License
                    <br />
                    Platform Rules
                    <br />
                    Content And Intellectual Property
                    <br />
                    Privacy Policy
                    <br />
                    Reviews By Hosts And Guests
                    <br />
                    Service Fees And How They Are Handled
                    <br />
                    Credit Card Fees And Bank Card Fees
                    <br />
                    Linking Policy
                    <br />
                    Addressing Damage Complaints
                    <br />
                    Termination Of Your Account With Flyinn
                    <br />
                    Fraudulent And Suspicious Activity
                    <br />
                    Suggestions And Feedback
                    <br />
                    How Searches Are Performed
                    <br />
                    Changes To The Platform
                    <br />
                    Changes And Cancelations To Bookings
                  </p>
                  <p className="mt-3">
                    <strong>HOSTS:</strong>
                    <br />
                    Termination Of Listings
                    <br />
                    Hosts And Taxes
                    <br />
                    Using Third-Party Websites To Get Hosts’ Listings More
                    Exposure
                    <br />
                    Proof Of Ownership Or Authorization
                    <br />
                    Insurance For Hosts
                    <br />
                    Host Assumption Of Risk
                  </p>
                  <p className="mt-3">
                    <strong>GUESTS:</strong>
                    <br />
                    Insurance For Guests
                    <br />
                    Account Termination Or Suspension
                    <br />
                    Guest Assumption Of Risk
                  </p>
                  <p className="mt-3">
                    Disclaimer Of Warranties
                    <br />
                    Limitations On Liability
                    <br />
                    Indemnification And Release
                    <br />
                    Contracting Entities
                  </p>
                  <p className="mt-3">
                    Mandatory Pre-Arbitration Dispute Resolution And
                    Notification
                    <br />
                    Notice
                    <br />
                    Agreement To Arbitrate (“Arbitration Agreement”)
                    <br />
                    Arbitration Rules And Governing Law
                    <br />
                    Arbitration Controversy Amount Determines Location
                    <br />
                    Arbitration Fees And Costs
                    <br />
                    Improper Purpose, Bad Faith, Frivolous
                    <br />
                    Arbitrator’s Decision
                    <br />
                    Class Actions, Representative Proceedings, Jury Trials
                    <br />
                    Jury Trial Waiver
                    <br />
                    Small Claims Vs. Arbitration
                    <br />
                    Offer Of Judgment
                    <br />
                    Severability And Survival
                  </p>
                  <p className="mt-3">
                    Interpreting The Terms
                    <br />
                    Assignment
                    <br />
                    No Waiver
                    <br />
                    Force Majeure
                    <br />
                    Emails And SMS
                    <br />
                    Contact Us
                  </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  MODIFICATION OF TERMS
                </h2>
                <p>
                  FlyInn reserves the right to amend these Terms in whole or in
                  part, at any time, in our sole discretion.
                  <br />
                  Should we make a change to these Terms, a notification will be
                  posted on the Platform along with the revised Terms and we
                  will update the date at the top of these Terms, which is
                  labeled “Last Updated”. Amendments are effective immediately.
                  <br />
                  In the case of a material change, at least 30 days before the
                  date it becomes effective, we will additionally provide you
                  with notice of such change via email, an SMS, WhatsApp
                  message, or a notification on the Platform, visible in your
                  inbox in your dashboard; and/or any alternate method of
                  communication you provide us with and we make available.
                  <br />
                  You are responsible for reviewing the changes. Should you not
                  agree with the updated Terms, you have the option to terminate
                  this agreement immediately in accordance with the provisions
                  outlined in these Terms.
                  <br />
                  If you do not terminate your agreement before the effective
                  date of the revised Terms, your ongoing access to or use of
                  the Platform will constitute your acceptance of the updated
                  Terms.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  MEMBER ELIGIBILITY, ACCOUNT REGISTRATION, AND IDENTITY
                  VERIFICATION
                </h2>
                <p>
                  Only registered <strong>Members</strong> can be{" "}
                  <strong>Hosts</strong> and
                  <strong>Guests</strong> on the <strong>Platform</strong>.
                  Being a registered Member allows you to <strong>List</strong>{" "}
                  properties for rent, rent properties from other Members, send
                  and receive messages, leave comments and reviews, and more.
                  <br />
                  We strive to take whatever measures are legally available to
                  us to verify the identity of each guest before we complete
                  their registration. Because no measure is infallible, we
                  cannot guarantee anyone’s identity and we therefore assume no
                  responsibility for confirming any Member’s identity.
                  <br />
                  There are a few requirements to be a registered Member of the
                  Platform.
                </p>
                <p className="my-4">
                  By using and registering on the Platform, you hereby affirm
                  that
                </p>
                <ol className="my-3 list-decimal pl-5 space-y-1">
                  <li>You are at least 18 years of age</li>
                  <li>
                    You are able to enter into legally binding contracts under
                    applicable law
                  </li>
                  <li>
                    If you are utilizing the Platform’s services on behalf of a
                    business or another entity, or if you enter into contracts
                    with third parties, you have the authorization to legally
                    bind your team, business or other organization or entity to
                    these Terms
                  </li>
                  <li>
                    Each entity is compliant with the laws of the jurisdiction
                    where it is established
                  </li>
                  <li>You are not a convicted sex offender</li>
                  <li>
                    You are not prohibited from using the Platform under the
                    laws of the United States, or any other applicable
                    jurisdiction
                  </li>
                  <li>
                    You will submit to us and to the Platform only true,
                    accurate, current, and complete information
                  </li>
                  <li>
                    You will maintain the accuracy of such information and
                    promptly update it as necessary.
                  </li>
                </ol>
                <p className="my-4">
                  By using and registering on the Platform, you commit to
                </p>
                <ol className="pl-5 my-3 list-decimal space-y-1">
                  <li>
                    Completing your registration with current and accurate
                    information upon registering on the Platform
                  </li>
                  <li>
                    Ensuring that your account details stay current and accurate
                  </li>
                  <li>
                    Keeping your account details both on the Platform and on
                    your email account, including your
                    <strong>Username</strong> and <strong>Password</strong>,
                    secure and strictly confidential
                  </li>
                  <li>
                    Providing your account details only to authorized users of
                    your accounts and asking them not to disclose them to anyone
                    else without your consent
                  </li>
                  <li>
                    Notifying FlyInn immediately by phone at 833-I-FLY-INN or
                    321-I-FLY-INN if you suspect any compromise of your
                    credentials or unauthorized access to your account, or if
                    anyone has contacted you requesting your login credentials
                  </li>
                  <li>
                    Changing your Username and Password immediately on both your
                    email account and on the Platform if you or we suspect that
                    your login credentials have been lost or stolen, and/or your
                    account with us has been accessed without your consent or
                    knowledge or has been otherwise compromised
                  </li>
                  <li>
                    Complying with any reasonable requests we make to protect
                    and secure your account (If we believe, at our sole
                    discretion, that your account on either the Platform or your
                    email is being used fraudulently or by an unauthorized
                    entity, and If we are unable to contact you or if you fail
                    to respond to our requests promptly, we reserve the right,
                    without notice to you or from you, to suspend or terminate
                    your account and/or cancel any Listings you may have at any
                    time.)
                  </li>
                  <li>
                    Not transferring your account to another individual.
                    Transferring your account to another individual is
                    prohibited.
                  </li>
                </ol>
                <p>
                  <strong>PLEASE READ CAREFULLY:</strong> FlyInn will not be
                  held liable to any User for any unauthorized transaction
                  conducted through the use of any User’s ID or password. You
                  are solely accountable, financially and otherwise, for any
                  activities and for all transactions conducted by anyone
                  through your account on the Platform and through your email
                  account, including any transactions you did not want or were
                  fraudulently made. Safeguard your account credentials—the
                  unauthorized and/or fraudulent use of your login credentials
                  for your FlyInn or email account may result in you being held
                  liable to both FlyInn and other Members and Users.
                </p>
                <p>
                  FlyInn reserves the right, in accordance with applicable law,
                  to undergo <strong>identity verification</strong>
                  and checks to provide us with information about your
                  background; to request that you furnish us with identification
                  and/or any other information we deem necessary in our sole
                  discretion; to check the information you provide us with
                  against third-party databases and additional sources and ask
                  that reports be provided to us; and access public records in
                  order to obtain information and reports regarding criminal
                  convictions including sex offender registrations.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  FLYINN’S ROLE, MEMBERS’ RESPONSIBILITY, CONDUCT, AND USE
                </h2>
                <ol className="pl-5 space-y-4 list-decimal">
                  <li>
                    FlyInn’s Role
                    <ol className="list-[lower-alpha] pl-5 space-y-1 mt-1">
                      <li>
                        The Platform is a vehicle to facilitate browsing,
                        offering, and booking{" "}
                        <strong>
                          Rental Properties<strong> and other </strong>Goods
                        </strong>{" "}
                        and
                        <strong>Services</strong>
                      </li>
                      <li>
                        FlyInn is <strong>not</strong> a travel agency, real
                        estate agency, or insurance agency. FlyInn does not act
                        as an agent for any member in any capacity
                      </li>
                      <li>
                        FlyInn is <strong>not a party</strong> to any contract
                        or transaction between Members
                      </li>
                      <li>
                        FlyInn does not own, operate, manage, list, or enter
                        into contracts for any <strong>Listings</strong> or
                        <strong>Services</strong>.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Members’ Responsibility, Conduct, and Use
                    <p className="mt-2">
                      We encourage Members to be honest, forthcoming,
                      responsible, generous, service-oriented, and in integrity;
                      and we have methods in place to ensure this is the case.
                      Nonetheless, neither the conduct nor use of the Platform
                      by Members is within our control. Members agree that it is
                      the responsibility of each Member that is party to an
                      actual or potential transaction to:
                    </p>
                    <ol className="pl-5 list-[lower-alpha] space-y-2 mt-2">
                      <li>
                        Hosts
                        <ol className="pl-5 !list-[lower-roman] space-y-1">
                          <li>
                            Ensure you are acting in good faith toward those to
                            whom you are offering your
                            <strong>Goods</strong> and <strong>Services</strong>
                            , and toward all other Members
                          </li>
                          <li>
                            Ensure the accuracy of your communications and the
                            accuracy of all information for each
                            <strong>Rental Property</strong>,{" "}
                            <strong>Good</strong>, or
                            <strong>Service</strong> offered in each of your
                            <strong>Listings</strong>
                          </li>
                          <li>
                            Ensure the cleanliness, hygiene, safety, quality,
                            etc. of your <strong>Listing</strong>
                          </li>
                          <li>
                            Ensure you have the legal right to enter into
                            contracts for the offerings in your
                            <strong>Listings</strong>
                          </li>
                          <li>
                            Ensure you are abiding by all laws, regulations,
                            ordinances, and rules that apply to your{" "}
                            <strong>Listing</strong>, your business as it
                            pertains to the transaction for said Listing, and
                            your conduct. Such laws, regulations, ordinances,
                            and rules include but are not limited to such topics
                            as taxes, privacy and the handling of data, zoning,
                            safety, licenses, permits, accessibility,
                            anti-discrimination, and&nbsp;
                            <CustomLink to="/fair-housing-policy">
                              fair{" "}
                            </CustomLink>
                            <CustomLink to="/fair-housing-policy">
                              housing
                            </CustomLink>
                          </li>
                          <li>
                            Ensure you are abiding by all of FlyInn’s
                            <strong>Terms</strong>, <strong>Policies</strong>,{" "}
                            <strong>Standards</strong>,
                            <strong>Guidelines</strong>, etc.
                          </li>
                        </ol>
                      </li>
                      <li>
                        Guests
                        <ol className="pl-5 !list-[lower-roman] space-y-1">
                          <li>
                            Ensure you are acting in good faith toward those
                            with whom you are contracting for
                            <strong>Goods</strong> and <strong>Services</strong>
                            , and toward all other Members
                          </li>
                          <li>Ensure the accuracy of your communications</li>
                          <li>
                            Ensure that you take proper care of the property
                            being rented to you
                          </li>
                          <li>
                            Ensure you are abiding by all laws, regulations,
                            ordinances, and rules that apply to your use of each{" "}
                            <strong>Listing</strong> for which you are
                            contracting, your business as it pertains to the
                            transaction for said Listing, and your conduct and
                            the conduct of other Guests receiving benefit from
                            the transaction
                          </li>
                          <li>
                            Ensure you are abiding by all of FlyInn’s
                            <strong>Terms</strong>, <strong>Policies</strong>,
                            etc.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  LICENSE
                </h2>
                <p>
                  A <strong>limited</strong>, <strong>revocable</strong>,{" "}
                  <strong>non-exclusive</strong>,
                  <strong>non-sublicensable</strong>,{" "}
                  <strong>non-transferable license</strong> is granted to each{" "}
                  <strong>User</strong> or <strong>Member</strong> to download
                  the app on any of your personal device(s); utilize the app on
                  any of your personal device(s); obtain access to the{" "}
                  <strong>Platform</strong>, its content,{" "}
                  <strong>Listings</strong> for
                  <strong>Rental Properties</strong> and the associated{" "}
                  <strong>Goods</strong> and
                  <strong>Services</strong> offered; and any other use
                  specifically mentioned on the Platform, solely for your{" "}
                  <strong>personal and non-commercial use</strong> and in
                  accordance with the
                  <strong>Terms</strong>. Any other use of the Platform or any
                  use that violates the Terms is strictly forbidden unless
                  explicitly allowed by us in writing.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  PLATFORM RULES
                </h2>
                <ol className="pl-5 space-y-4 list-decimal">
                  <li>
                    Technology Rules
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        The use of data mining, robots (bots), crawlers,
                        spiders, scrapers, or other automated methods to access,
                        gather, extract, or collect any data or interact with
                        the <strong>Platform</strong> in any way is strictly
                        forbidden
                      </li>
                      <li>
                        Copying, duplicating, scraping, displaying, mirroring,
                        framing, et al is strictly forbidden
                      </li>
                      <li>
                        Evading security by hacking, compromising, impairment,
                        removal, or other means is strictly forbidden
                      </li>
                      <li>
                        Reverse engineering, decompiling, disassembling, or
                        deciphering the <strong>Platform</strong>, software, or
                        hardware used to make the Platform run is strictly
                        prohibited
                      </li>
                      <li>
                        Any attempt to tamper with our search algorithm is
                        strictly prohibited
                      </li>
                      <li>
                        Any action that we deem, in our sole discretion, could
                        cause harm to the <strong>Platform</strong> or its
                        systems, performance, or function is strictly
                        prohibited.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct Rules with regard to treatment of the site
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Do not copy, duplicate, reproduce, display, post,
                        upload, distribute, broadcast, or transmit any part of
                        the <strong>Content</strong>, FlyInn’s branding, page
                        layout, or design in any form whatsoever
                      </li>
                      <li>
                        Do not deep-link to any part, page, or area of the{" "}
                        <strong>Platform</strong> without our explicit written
                        consent.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct Rules with regard to the use of the Platform
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Only <strong>Members</strong> in good standing,
                        authorized to use the Platform under a valid license as
                        outlined above may use the site
                      </li>
                      <li>
                        Using the <strong>Platform</strong> or any tools, such
                        as searching or booking, or any other services thereon
                        for any purpose other than booking or listing a{" "}
                        <strong>Listing</strong>, or booking or purchasing a{" "}
                        <strong>Good</strong> or <strong>Service</strong>, is
                        strictly prohibited
                      </li>
                      <li>
                        See our{" "}
                        <CustomLink to="/Off-the-Platform-Fees-Policy">
                          Off-the-Platform Fees Policy
                        </CustomLink>{" "}
                        for exceptions.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct Rules with regard to Content and Intellectual
                    Property
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        <strong>Content</strong> published on the{" "}
                        <strong>Platform</strong> is only for the purpose of
                        carrying out your activities on the Platform, under
                        these Terms, as a <strong>Member</strong>,{" "}
                        <strong>Guest</strong>, or <strong>Host</strong>
                      </li>
                      <li>
                        <strong>Content</strong> published on the Platform can
                        only be used with express written permission from the
                        owner of said content or with our permission either
                        outlined in these <strong>Terms</strong> or through
                        another written agreement
                      </li>
                      <li>
                        Infringing on our rights or the rights of third parties
                        with the intent to plagiarize or violate the
                        intellectual or proprietary rights to copyrights,
                        trademarks, service marks, branding, patents, trade
                        secrets, privacy, or any other right is strictly
                        prohibited. See our{" "}
                        <CustomLink to="/trademark-policy">
                          Trademark Policy
                        </CustomLink>
                      </li>
                      <li>
                        Using or registering any trademarks, service marks,
                        branding, patents, domain names, social media handles,
                        etc. that are similar enough [to those of FlyInn] to
                        cause confusion is strictly prohibited. See our{" "}
                        <CustomLink to="/trademark-policy">
                          Trademark Policy
                        </CustomLink>
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct with regard to respecting others on the Platform
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Be respectful and courteous when you communicate or
                        exchange with other <strong>Members</strong>
                      </li>
                      <li>
                        Treat the property of other Members with the utmost most
                        care and respect
                      </li>
                      <li>
                        Do not lie; do not be purposely inaccurate, fraudulent,
                        or misleading; do not falsify, omit material
                        information, or impersonate anyone; do not participate
                        in phishing; all of the above activities are strictly
                        prohibited
                      </li>
                      <li>
                        Posting or sharing any <strong>content</strong> that is
                        illegal, sexually explicit, pornographic, menacing,
                        harmful, slanderous, defamatory, lewd, obscene, crude,
                        inappropriate, provocative, etc. is strictly prohibited
                      </li>
                      <li>
                        Only book <strong>Listings</strong> that you will use
                        yourself
                      </li>
                      <li>
                        Asking, requiring, enticing, or influencing other
                        Members to interact with a third-party website,
                        application, or service for the purpose of securing a
                        positive review for yourself, or any other benefit to
                        yourself of that nature is strictly prohibited
                      </li>
                      <li>
                        Using the property you have booked as a venue for a
                        party, gathering, get-together, or other type of event
                        that goes beyond the number of guests you claimed on
                        your reservation would occupy the premises, without
                        having such authorization from the <strong>Host</strong>{" "}
                        is strictly prohibited. You are responsible financially
                        and otherwise for any violations of our{" "}
                        <CustomLink to="/Neighborhood-Nuisance-and-Disruptive-Behavior-Policy">
                          Neighborhood Nuisance and Disruptive Behavior Policy
                        </CustomLink>
                        herein incorporated by reference.
                      </li>
                      <li>
                        Do not circumvent our enforcement of these
                        <strong>Terms</strong> or any Terms herein incorporated
                        by reference. See our complete list of Policies under
                        the Section titled by the same name, contained in this
                        document and incorporated by reference.
                      </li>
                      <li>
                        Discrimination violates fair housing laws and creates
                        division within our tight-knit community.In all
                        circumstances adhere to our&nbsp;
                        <CustomLink to="/fair-housing-policy">
                          Fair Housing Policy
                        </CustomLink>
                        .
                      </li>
                      <li>
                        Offer to sell, sell, transfer, or license any part of
                        the <strong>Platform</strong> in any form to third
                        parties;
                      </li>
                      <li>
                        Transacting, bartering, or exchanging outside of the{" "}
                        <strong>Platform</strong> for any reason whatsoever is
                        strictly prohibited, with exceptions. See our&nbsp;
                        <CustomLink to="/Off-the-Platform-Fees-Policy">
                          Off-the-Platform Fees Policy
                        </CustomLink>
                        .
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct with regards to privacy and personal information
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Get familiar with laws that deal with
                        <strong>privacy</strong> and data handling
                      </li>
                      <li>
                        These <strong>Terms</strong> authorize{" "}
                        <strong>Members</strong> to use another Member’s
                        personal information on this Platform only on an “as
                        needed” basis and only to facilitate a transaction.
                        Neither personal information, nor the{" "}
                        <strong>Platform</strong> may be used in any other way
                        without the explicit consent of the owner of such
                        personal information.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Conduct with regard to what is legal versus illegal
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Offering <strong>Rental Properties</strong>,{" "}
                        <strong>Goods</strong>, and
                        <strong>Services</strong> that violate laws, rules,
                        regulations, and ordinances are strictly prohibited on
                        this Platform
                      </li>
                      <li>
                        Using a <strong>Listing</strong> for prostitution, even
                        in areas where prostitution is legal is strictly
                        prohibited
                      </li>
                      <li>
                        Consumption by any <strong>Guest</strong> or guests of
                        any drugs inside a <strong>Rental Property</strong>, or
                        anywhere on the property, especially with the intent to
                        intoxicate oneself, when said drugs are not prescribed
                        by a physician and are not “over the counter”, is
                        strictly prohibited
                      </li>
                      <li>
                        Alcohol consumption must be limited to the Federal
                        Aviation Administration’s legal BAC for flying (.04%).
                      </li>
                    </ol>
                  </li>
                  <li>
                    Dealing with Violations
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Should you become aware of or personally experience any{" "}
                        <strong>Content</strong>, activity, communication or{" "}
                        <strong>Listing</strong> is in violation of any
                        provision in these <strong>Terms</strong>, we request
                        that you inform us by contacting us either on our
                        contact form with the subject title “Violations”, email
                        us at{" "}
                        <CustomLink to="mailto:violations@fly-inn.com">
                          violations@fly-inn.com
                        </CustomLink>{" "}
                        with the subject title “Violations”, or call us at
                        either of our phone numbers listed on our Contact page
                      </li>
                      <li>
                        Should you become aware of a situation in which there is
                        an imminent risk of harm to a person or property, first
                        and immediately contact the appropriate local
                        authorities.
                      </li>
                    </ol>
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CONTENT AND INTELLECTUAL PROPERTY
                </h2>
                <p>
                  All <strong>Content</strong> on the <strong>Platform</strong>{" "}
                  and the Platform itself is a collective work/compilation and
                  may be protected by database rights, copyrights, trademarks,
                  patents, or other laws and conventions as such.
                  <br />
                  You hereby acknowledge that all intellectual property rights
                  for the Content are property of FlyInn. You hereby agree to
                  abide by any and all copyright notices, information, and/or
                  restrictions contained on this Platform.
                  <br />
                  Content, herein referred to as “<strong>Content</strong> ”,
                  includes but is not limited to all information, writing,
                  graphics, photography, videography, audio recordings, logos,
                  user-generated or otherwise; trademarks; service marks; trade
                  dress; and software programs.
                </p>
                <p>
                  <strong>Content Submitted by Members:</strong>
                  <br />
                  By providing or authorizing <strong>Content</strong>, in
                  whatever form and through whatever means, you grant FlyInn a
                  <strong>non-exclusive</strong>, <strong>unrestricted</strong>,{" "}
                  <strong>worldwide</strong>,<strong>royalty-free</strong>,{" "}
                  <strong>fully paid-up</strong>, <strong>irrevocable</strong>,
                  <strong>perpetual</strong>,{" "}
                  <strong>sub-licensable and transferable license</strong> to
                  host, run, access, use, adapt, edit, copy, reproduce, modify,
                  translate, store, prepare derivative works of, distribute,
                  display, publicly perform, publish, transmit, broadcast,
                  stream and otherwise exploit the Content, in any manner in
                  connection with our business and to promote and/or supply the{" "}
                  <strong>Platform</strong> and on any media or Platform without
                  limitation.
                  <br />
                  You bear full responsibility for any <strong>
                    Content
                  </strong>{" "}
                  you submit to be used in any way on our Platform, including
                  but not limited to, <strong>Listings</strong>,
                  <strong>Reviews</strong>, or Squawks (our blog).
                  <br />
                  We specifically and expressly disclaim all liability for any{" "}
                  <strong>Content</strong> you submit.
                  <br />
                  All <strong>Content</strong> must adhere to these{" "}
                  <strong>Terms</strong> and to our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>
                  ,&nbsp;
                  <CustomLink to="/fair-housing-policy">
                    Fair Housing Policy
                  </CustomLink>
                  , and, if it contains personal information, to our{" "}
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>
                  .<br />
                  Namely, <strong>Content</strong> cannot be false, knowingly
                  inaccurate, or misleading; include anyone’s personal
                  information explicitly or be presented in such a way that it
                  might be used to identify, locate, or contact anyone; be
                  abusive, discriminatory, obscene, or inappropriate in any way;
                  break the law; include any SPAM; or any other restriction
                  found in any of our policies or guidelines.
                  <br />
                  In addition, <strong>Content</strong> must be directly related
                  to the transaction, <strong>Listing</strong>,{" "}
                  <strong>Rental Property</strong>,<strong>Goods</strong>,{" "}
                  <strong>Services</strong>, or Squawk for which it is
                  submitted.
                  <br />
                  You attest and warrant that you legally own the
                  <strong>Content’s copyright</strong> or that you have the
                  necessary authority from the owner thereof to grant FlyInn the
                  rights contained therein. Should you not own the copyright, it
                  is your responsibility to secure all authorizations required
                  to grant said rights. <br />
                  We reserve the right to ask that you provide proof of
                  ownership or proof of the necessary authority. <br />
                  We reserve the right to decline to post your
                  <strong>Content</strong> without such evidence, or remove your
                  Content, if we, at our discretion, don’t believe you have
                  given us enough proof.
                  <br />
                  Should any of your <strong>Content</strong> violate or
                  infringe upon the intellectual property or privacy rights of
                  any third party, you are solely responsible and may be held
                  liable. Furthermore, you will indemnify and hold harmless
                  FlyInn or any member thereof should a third party claim that
                  their copyright has been violated.
                  <br />
                  Any <strong>Content</strong> provided to FlyInn by a{" "}
                  <strong>Member</strong> is liable to undergo review and
                  approval by our team, in our sole discretion, before we accept
                  it. <br />
                  We are not obligated to review Content submitted by Members
                  and we are not liable for any loss or damage resulting from
                  the design or positioning of the writing, properties, content,
                  photographs, audio or video, or any change made to the same.
                  <br />
                  We reserve the right to decline the publication of, or remove,
                  any <strong>Content</strong> that in our sole discretion we
                  deem does not adhere to these <strong>Terms</strong>
                  <br />
                  or our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>
                  , which is incorporated by reference into these Terms,
                  <br />
                  or is otherwise deemed unacceptable to us.
                  <br />
                  We reserve the right but are not obligated to make minor
                  adjustments to any content you submit to make sure it adheres
                  to our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>{" "}
                  and/or meets our format criteria.
                  <br />
                  We reserve the right but are not obligated to create a
                  <strong>Listing</strong> for a <strong>Member</strong> or
                  improve an existing one.
                  <br />
                  We do not provide a guarantee regarding the revisions’
                  accuracy or quality. It is the responsibility of the
                  <strong>Members</strong> to verify the accuracy, design, or
                  otherwise of such revisions themselves, and to make sure that
                  any <strong>Content</strong> they submit appears on the
                  <strong>Platform</strong> the way they envisioned.
                  <br />
                  We may also, from time to time, at our sole discretion, make
                  use of translation services or tools to translate your
                  submissions to make available to other{" "}
                  <strong>Members</strong> around the world.
                  <br />
                  We do not provide a guarantee regarding the translations’
                  accuracy or quality. It is the responsibility of the{" "}
                  <strong>Members</strong> to verify the accuracy of such
                  translations themselves.
                  <br />
                  We may also, at any time, without notice, at our sole
                  discretion, rearrange how geographic descriptors are arranged
                  on the <strong>Platform</strong> or completely create new ones
                  altogether. The <strong>Host</strong> is solely responsible
                  for ensuring that the <strong>Listing’s</strong> location is
                  accurate and how the location relates to the geographic
                  descriptors we have created or rearranged. Hosts agree to
                  either correct on their own or contact us to correct any
                  inaccuracy for them. Guests are solely responsible for
                  verifying the accuracy of the
                  <strong>Listing’s</strong> location and how the location
                  relates to the geographic descriptors we have created or
                  rearranged.
                </p>
                <p>
                  Please inform us if you think that any{" "}
                  <strong>Content</strong> on the <strong>Platform</strong>{" "}
                  violates our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>
                  , which is incorporated by reference into these
                  <strong>Terms</strong>. You may contact us by emailing us at{" "}
                  <CustomLink to="mailto:violations@fly-inn.com">
                    violations@fly-inn.com
                  </CustomLink>
                  , by using our contact form on our Contact Page and writing
                  “Content Violations” in the subject line, or by calling us at
                  the numbers listed on our Contact Page.
                </p>
                <p>
                  <strong>Copyright: </strong>
                  <br />
                  The “FlyInn” name and logo including the red biplane, and
                  “Fly-Inn” are <strong>trademarks</strong> in the United States
                  and other countries.
                  <br />
                  You hereby agree that you will not alter, delete, obscure, or
                  conceal any trademark, copyright, or other notice appearing in
                  any <strong>Content</strong> on the
                  <strong>Platform</strong>.
                  <br />
                  Except for your use in accordance with an active
                  <strong>Listing</strong>, you agree that use of the{" "}
                  <strong>Content</strong> is for your <strong>personal</strong>
                  , <strong>non-commercial</strong> use and you shall not use,
                  copy, reproduce, store, adapt, modify, create derivative
                  works, distribute, license, sell or offer it for sale,
                  transfer, publish, publicly display, publicly perform,
                  distribute, transmit, stream, broadcast over any network,
                  including a local area network, or in any way exploit any{" "}
                  <strong>Content</strong>
                  made available through or on the Platform except as expressly
                  permitted in these <strong>Terms</strong> or as the legal
                  owner of the <strong>Content</strong>. Any other use is
                  expressly prohibited without first obtaining written
                  permission from FlyInn.
                </p>
                <p>
                  All <strong>intellectual property rights</strong> not
                  expressly granted herein are reserved to FlyInn and our
                  respective licensors, where applicable.
                </p>
                <p>
                  <strong>What is allowed: </strong>
                  <br />
                  You may screenshot, download, display, and/or print one “Copy”
                  of any portion of the <strong>Platform</strong>, as long as it
                  is for your own <strong>personal</strong>,{" "}
                  <strong>noncommercial use</strong> such as that applies to
                  part of the rental inquiry or reservation process and not for
                  further distribution. You may not alter or modify the Copy you
                  have made, and you must ensure our copyright notice is visible
                  in your Copy.
                </p>
                <p>
                  <strong>How to obtain our permission: </strong>
                  <br />
                  If you would like our permission to use our name or logo in
                  any other way, please email us at{" "}
                  <CustomLink to="mailto:legal@fly-inn.com">
                    legal@fly-inn.com{" "}
                  </CustomLink>
                  for our written permission. We reserve the right to refuse
                  such permission at our sole discretion.
                </p>
                <p>
                  You can use our name or logo in a <strong>Listing</strong>{" "}
                  without needing express written permission, as long as you
                  adhere to these general guidelines:
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    You may use the name, <strong>FlyInn</strong>, or the name
                    of the
                    <strong>Platform</strong>, <strong>Fly-Inn</strong> or{" "}
                    <strong>Fly-Inn.com</strong>, as long as it is{" "}
                    <strong>descriptive</strong>, <strong>honest</strong>,
                    <strong>accurate</strong> and based on facts. For example,
                    “You can rent my property by visiting Fly-Inn.com,” “I love
                    being a host on Fly-Inn,” or “FlyInn has a great team!”
                  </li>
                  <li>
                    You may not use the name, <strong>FlyInn</strong>, or the
                    name of the <strong>Platform</strong>,{" "}
                    <strong>Fly-Inn</strong> or <strong>Fly-Inn.com</strong>, or
                    any of our affiliates in any way that might imply or lead
                    someone to believe that <strong>partnership with</strong>,
                    <strong>affiliation with</strong>,{" "}
                    <strong>sponsorship by</strong>, or
                    <strong>endorsement by</strong> FlyInn exists with you or
                    with your business, property, <strong>Listing</strong> or
                    website. Examples of unacceptable use include “FlyInn Real
                    Estate,” “FlyInn Holding Company,” “Fly-Inn.com website
                    services,” “FlyInn Carpet Cleaning,” “FlyInn Travel Agency”
                    or “Fly-Inn’s hottest property”
                  </li>
                  <li>
                    You must obtain our <strong>written permission</strong>{" "}
                    before using the <strong>FlyInn</strong> or{" "}
                    <strong>Fly-Inn</strong> names or any of our affiliate names
                    on any other website that lists short-term rentals.
                  </li>
                </ol>
                <p>
                  Because we acknowledge and uphold the intellectual property
                  rights of others, we strictly prohibit the posting of any{" "}
                  <strong>Content</strong> on the <strong>Platform</strong> that
                  violates the copyright of any individual or entity. FlyInn
                  reserves the right to terminate the membership of any{" "}
                  <strong>Member</strong> who repeatedly violates copyright.
                </p>
                <p>
                  You authorize us, and our affiliates, if applicable, to
                  register copyrights and safeguard all <strong>Content</strong>
                  submitted by <strong>Users</strong>, as outlined in these
                  <strong>Terms</strong>, against the unauthorized use by third
                  parties who may try to unlawfully replicate such information
                  through electronic or other methods. This encompasses the
                  right to take legal action to obtain injunctive relief for the
                  protection of such
                  <strong>Content</strong> on your behalf and in your name.
                  Additionally, you commit to appearing and cooperating with us,
                  at our expense, in safeguarding such copyrighted Content
                  against unauthorized redistribution.
                </p>
                <p>
                  If you think that any content on the <strong>Platform</strong>
                  violates copyrights, please inform us following our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>{" "}
                  which is incorporated by reference into these Terms. You may
                  contact us by emailing us at{" "}
                  <CustomLink to="mailto:legal@fly-inn.com">
                    legal@fly-inn.com{" "}
                  </CustomLink>
                  and using “Copyright Infringement” in the subject line; using
                  our contact form on our Contact Page and using “Copyright
                  Infringement” in the subject line; or by calling us at the
                  numbers listed on our Contact Page.
                </p>
                <p>
                  <strong>
                    YOU ACKNOWLEDGE AND AGREE THAT YOU WILL NOT HOLD US OR ANY
                    THIRD-PARTY PROVIDER RESPONSIBLE FOR THE CONTENT PROVIDED BY
                    ANY USER, INCLUDING, BUT NOT LIMITED TO, ANY TRANSLATIONS
                    THEREOF.
                  </strong>
                  <br />
                  <strong>
                    ADDITIONALLY, YOU ACKNOWLEDGE AND AGREE THAT WE ARE NOT
                    INVOLVED IN ANY RENTAL TRANSACTION OR OTHER TRANSACTION
                    BETWEEN MEMBERS OF THE PLATFORM.
                  </strong>
                </p>
                <p>
                  <strong>
                    WE DO NOT CONTROL OR GUARANTEE (EXCEPT FOR ANY GUARANTEE
                    OFFERED ON THE PLATFORM) THE SAFETY OF ANY TRANSACTION OR
                    RENTAL PROPERTY, INCLUDING ALL PERSONAL PROPERTY ASSOCIATED
                    WITH THE OFFERING OR LISTING, NOR THE TRUTH OR ACCURACY OF
                    ANY LISTING OR OTHER CONTENT PROVIDED ON THE PLATFORM.
                  </strong>
                  <br />
                  <strong>
                    FURTHERMORE, YOU RECOGNIZE THAT BY DISPLAYING INFORMATION OR
                    LISTINGS IN SPECIFIC DESTINATIONS, WE DO NOT REPRESENT OR
                    GUARANTEE THAT TRAVELING TO ANY OF THOSE DESTINATIONS IS
                    RISK-FREE, AND WE ARE NOT RESPONSIBLE FOR ANY DAMAGES
                    INCURRED REGARDING TRAVEL TO ANY DESTINATION.
                  </strong>
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  PRIVACY POLICY – ABOUT
                </h2>
                <p>
                  <strong>Your Name and Information: </strong>
                  <br />
                  By accessing or using the <strong>Platform</strong>, or any
                  service or tool provided on the Platform or otherwise, you
                  acknowledge and agree to our{" "}
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>.
                  We uphold strict privacy principles. You consent to our access
                  and utilization of <strong>Content</strong> you have furnished
                  in line with these <strong>Terms</strong> or our{" "}
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>,
                  and we commit to disclosing your
                  <strong>Member-contributed content</strong> only as per these
                  <strong>Terms</strong> and our{" "}
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>
                  .<br />
                  When you provide your name, email address, or any other
                  information, you consent to us sending you training,
                  newsletters, announcements, promotional emails, offers,
                  alerts, confirmations, surveys, and/or other general
                  communication occasionally. However, you have the option to
                  decline to receive promotional emails at any point. For more
                  details on our email and other data collection practices, as
                  well as how to opt out of receiving such emails, please refer
                  to our{" "}
                  <CustomLink to="/privacy_policy">Privacy Policy</CustomLink>.
                </p>
                <p>
                  <strong>Others’ Names and Information: </strong>
                  <br />
                  We have a <strong>zero-tolerance policy</strong> towards
                  unsolicited commercial electronic communications or
                  <strong>SPAM</strong>. Hence, you are strictly prohibited from
                  adding a <strong>Member</strong> to your mailing list or email
                  list or utilizing any tool or service on the{" "}
                  <strong>Platform</strong>
                  to send such communications without the explicit consent of
                  the user, including those Members who have rented a{" "}
                  <strong>Rental Property</strong> to you or from you on the
                  Platform.
                </p>
                <p>
                  We have granted you a <strong>license</strong> to use other
                  <strong>Members’ personal information</strong> (and you agree
                  that other Members may use yours) in accordance with this
                  clause. Such license is only valid as long as your account on
                  the <strong>Platform</strong> is kept in good standing. You
                  commit that you will not abuse your license and you will
                  safeguard other Members’ personal information with at least a{" "}
                  <strong>reasonable standard of care</strong> and judgment and
                  you understand that you are solely liable for losing,
                  mishandling, or divulging to any third party said information
                  without the express written consent of the other Member.
                </p>
                <p>
                  You agree that this <strong>license</strong> shall be used
                  solely for the purpose of facilitating a{" "}
                  <strong>transaction</strong>, that is related to the purpose
                  of the <strong>Platform</strong>, between you and the other{" "}
                  <strong>Member</strong>; and non-SPAM messages. You will need
                  explicit permission from the Member for any alternative use of
                  such information. It is prohibited to utilize any such
                  information for any unlawful purpose or with any unlawful
                  intent.
                </p>
                <p>
                  Even if you have received permission from another
                  <strong>Member</strong> to add them to your mailing list or
                  email list, the law demands that you immediately remove the
                  Member’s information from your database or elsewhere and also
                  give them a chance to view what information you had about
                  them.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  REVIEWS BY HOSTS AND GUESTS
                </h2>
                <p>
                  <strong>Hosts</strong> and <strong>Guests</strong> have an
                  opportunity to leave a <strong>review</strong> for each other.
                  This review process helps the other <strong>Member</strong>{" "}
                  who was party to the transaction know which areas they are
                  excelling in and which areas they could improve. Reviews also
                  help prospective
                  <strong>Guests</strong> get an idea of what to expect when
                  booking a specific property, and prospective{" "}
                  <strong>Hosts</strong> what to expect from a particular{" "}
                  <strong>Guest</strong>. Because reviews are crucial to
                  maintaining standards of excellence both in the quality of the{" "}
                  <strong>Listing</strong> and the behavior and responsibility
                  of the <strong>Host</strong> and
                  <strong>Guest</strong>, your review must be{" "}
                  <strong>accurate</strong>,<strong>detailed</strong>, and{" "}
                  <strong>honest</strong> and may not contain any language that
                  is <strong>offensive</strong>, <strong>defamatory</strong>,
                  <strong>discriminatory</strong>, or otherwise violates these
                  <strong>Terms</strong>, our{" "}
                  <CustomLink to="/copy_right">
                    Content and Copyright Policy
                  </CustomLink>
                  , or relevant law. Unless brought to our attention, reviews
                  are not verified by FlyInn for accuracy and may consequently
                  be incorrect or misleading. Please contact us if you find that
                  any review violates FlyInn’s <strong>Terms</strong>, policies,
                  or the law.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  SERVICE FEES AND HOW THEY ARE HANDLED
                </h2>
                <p>
                  FlyInn charges <strong>Hosts</strong> and{" "}
                  <strong>Guests</strong> a{" "}
                  <strong>
                    service fee<strong> when they use the </strong>Platform
                  </strong>{" "}
                  to complete a transaction. The <strong>service fee</strong>{" "}
                  represents a percentage of the amount of your booking. For
                  more information about the service fee, please visit our{" "}
                  <CustomLink to="/Service-Fees-Policy">
                    Service Fees Policy
                  </CustomLink>{" "}
                  page.
                </p>
                <p>
                  The <strong>service fee</strong> is refunded only if the{" "}
                  <strong>Guest</strong>
                  qualifies for a <strong>full refund</strong> under the{" "}
                  <strong>Host’s</strong>
                  cancellation policy on the particular <strong>
                    Listing
                  </strong>{" "}
                  that was booked.
                </p>
                <p>
                  Our{" "}
                  <CustomLink to="/Service-Fees-Policy">
                    Service Fees Policy
                  </CustomLink>{" "}
                  may change. Be sure you have your current email registered
                  with us as we will notify you of any upcoming changes to our
                  service fees. Should we change a fee, it will not affect any
                  booking you made before the date the change goes into effect.
                </p>
                <p>
                  You agree not to counsel other <strong>Members</strong> to
                  avoid paying FlyInn’s <strong>service fee</strong>.
                </p>
                <p>
                  Any applicable fees are disclosed to <strong>Guests</strong>{" "}
                  before making a booking. All Guests will be able to see a
                  breakdown of the reservation amount before they check out.
                  This includes the <strong>service fee</strong>; the cost of
                  the rental; all other charges associated with your booking,
                  including the ones you requested; and all applicable{" "}
                  <strong>taxes and fees</strong> charged by the government.
                </p>
                <p>
                  The breakdown also shows the <strong>Guest</strong> all
                  applicable
                  <strong>Taxes</strong>. In some areas, the jurisdiction
                  imposes a<strong>Value Added Tax (VAT)</strong> on bookings in
                  addition to the service fee.
                </p>
                <p>
                  <strong>
                    ALL MEMBERS ARE COMPLETELY AND SOLELY RESPONSIBLE FOR THE
                    HANDLING OF THEIR TAXES. FLYINN WILL REMIT ALL TAX COLLECTED
                    ON THE HOST’S BEHALF TO THE HOST. PLEASE SEE OUR
                  </strong>{" "}
                  <CustomLink to="/taxes-policy/">
                    <strong>TAXES POLICY</strong>
                  </CustomLink>{" "}
                  <strong>FOR MORE INFORMATION.</strong>
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CREDIT CARD FEES AND BANK CARD FEES
                </h2>
                <p>
                  Credit card companies could charge the <strong>User</strong>{" "}
                  fees in addition to their customary processing fee. The User
                  must review any agreement with their bank or credit card
                  company regarding any fees.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  LINKING POLICY
                </h2>
                <p>
                  We use <strong>Google Maps</strong> on the{" "}
                  <strong>Platform</strong>. Google Maps are subject to{" "}
                  <CustomLink to="https://www.google.com/intl/en_us/help/terms_maps/">
                    Google Maps’ terms of service
                  </CustomLink>
                  .
                </p>
                <p>
                  This <strong>Platform</strong> may include links and
                  references to other websites, applications, online resources,
                  services, affiliates, partners, and sponsors. We provide these
                  links and references solely for your information and
                  convenience. Links to and from this website to third-party
                  sites (maintained by them) do not imply our endorsement of
                  those third parties, their websites, or their content.
                  Additionally, we may offer tools for communication between
                  this website and third-party sites, such as social media
                  platforms. If you select a link to an outside website, you are
                  leaving the Fly-Inn.com <strong>Platform</strong> and are
                  subject to the terms, privacy, and security policies of the
                  external website. We are not accountable for these third-party
                  sites or their resources in any manner, and these{" "}
                  <strong>Terms</strong> will not regulate your usage of such
                  sites and resources.
                  <br />
                  Any links to external websites from <strong>
                    Members’
                  </strong>{" "}
                  pages are <strong>strictly prohibited</strong> and will be
                  promptly removed without prior notice, at our sole discretion.
                  Additionally, we reserve the right to impose penalty charges
                  for hypertext links at any given time.
                </p>
                <p>
                  The use of hypertext links to other websites and URLs of other
                  websites in <strong>Member’s</strong> pages and in our
                  <strong>Squawks</strong> (blog section) is{" "}
                  <strong>strictly prohibited</strong>. We reserve the right to
                  remove links of any kind or URLs without prior notice and at
                  our sole discretion.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ADDRESSING DAMAGE COMPLAINTS
                </h2>
                <p>
                  First and foremost, <strong>Guests</strong>, be reminded you
                  have agreed that by using the <strong>Platform</strong> to
                  book a<strong>Rental Property</strong> in a{" "}
                  <strong>Listing</strong>, you have agreed to take{" "}
                  <strong>reasonable care</strong> of the property you rented
                  and to follow your Hosts’ rules regarding their property which
                  rules exist, among other things, to ensure their property is
                  treated as they would treat it themselves, (not to mention
                  ensure safety). Many Damage complaints can be avoided if you
                  are conscientious and apply the <strong>Golden Rule</strong>.
                  Remember that we are a tight-knit community of aviation
                  enthusiasts. We understand responsibility for the lives and
                  property of others. Let us extend the same care to the{" "}
                  <strong>Listings</strong> we rent from our fellows.
                </p>
                <p>
                  Notwithstanding, should any <strong>Damage</strong> occur,
                  you, the
                  <strong>Guest</strong>, maintain that you will{" "}
                  <strong>collaborate</strong> with both FlyInn and the{" "}
                  <strong>Host</strong> in good faith doing whatever is
                  reasonable and necessary to arrive at a timely and effective
                  resolution including supplying any information and/or signing
                  any documents requested by entities including but not limited
                  to FlyInn, your insurance carrier, and/or local authorities.
                </p>
                <p>
                  If a <strong>Host</strong> complains that you, any of your
                  guests, or any pets have caused any <strong>Damages</strong>,
                  to a property that was booked on the <strong>Platform</strong>
                  , the complaining Host can notify FlyInn and/or seek
                  compensation by messaging you on our Platform.
                  <br />
                  <strong>Damages</strong>, herein referred to as “
                  <strong>Damage</strong>” or “<strong>Damages</strong>” are
                  defined as
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    Any <strong>Damages</strong> the <strong>Guest</strong> has
                    caused to any part of the property present in the{" "}
                    <strong>Listing</strong> at the Guest’s time of arrival,
                    whether that property be real or personal, and whether or
                    not it be represented in photographs or text in the Listing.
                  </li>
                  <li>
                    Any <strong>Damages</strong> resulting from the{" "}
                    <strong>loss of booking income</strong> that is a direct
                    result of the Damage caused under (1) above.
                  </li>
                  <li>
                    Any <strong>extra cleaning costs</strong> the{" "}
                    <strong>Host</strong> incurred as a result of the Guest’s
                    stay.
                  </li>
                </ol>
                <p>The process proceeds as follows:</p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    The <strong>Host</strong> contacts the{" "}
                    <strong>Guest</strong> through our messaging service and
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        Amicably and professionally describes the damage that
                        was caused
                      </li>
                      <li>Provides valid proof in photographs</li>
                      <li>
                        Submits receipts and/or copies of estimates of what it
                        will cost to correct the <strong>Damages</strong>.
                      </li>
                    </ol>
                  </li>
                  <li>
                    The <strong>Guest</strong> has <strong>24 hours</strong> to
                    contact FlyInn to make a full payment.
                  </li>
                  <li>
                    If the <strong>Guest</strong> does not pay or only pays a
                    part of the requested amount, the <strong>Host</strong>{" "}
                    contacts FlyInn.
                  </li>
                  <li>
                    FlyInn assesses the situation and decides, in its sole
                    discretion, the validity of the claim.
                  </li>
                  <li>
                    If FlyInn decides the claim is valid, FlyInn contacts the{" "}
                    <strong>Host</strong> through the <strong>Platform</strong>,
                    then via email and then via telephone to locate the
                    <strong>Guest</strong>, assess the Guest’s responsibility in
                    the matter, and resolve the issue.
                  </li>
                  <li>
                    If FlyInn decides, in its sole discretion, that
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>the claim is valid, and</li>
                      <li>
                        the <strong>Guest</strong> is responsible for the
                        <strong>Damages</strong>,
                      </li>
                    </ol>
                  </li>
                  <li>
                    The <strong>Guest</strong> has <strong>24 hours</strong> to
                    pay for the
                    <strong>Damages</strong>.
                  </li>
                  <li>
                    Should the <strong>Guest</strong> fail to pay for the{" "}
                    <strong>Damages</strong>
                    within the allotted time, the Guest agrees that FlyInn can
                    collect the amount of the Damage claim from the Guest
                    through the <strong>credit card</strong> the Guest used to
                    check out.
                  </li>
                  <li>
                    Should the payment fail, or the payment be contested by the{" "}
                    <strong>Guest</strong>, the Guest agrees that FlyInn may
                    <ol className="pl-5 list-[lower-alpha] space-y-1 mt-1">
                      <li>
                        contact the Guest’s insurance carrier to seek recovery
                        of the <strong>Damages</strong>;
                      </li>
                      <li>
                        Pursue any available remedies under applicable law
                        against the <strong>Guest</strong>;
                      </li>
                      <li>
                        Pursue any causes of action/claims against the
                        <strong>Guest</strong>; and
                      </li>
                      <li>Terminate the Guest’s FlyInn account.</li>
                    </ol>
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  TERMINATION OF YOUR ACCOUNT WITH FLYINN
                </h2>
                <p>
                  Fly-Inn is the community’s own little heaven on earth, a place
                  where everyone can come together as <strong>Hosts</strong>
                  and <strong>Guests</strong> and make it easy to enjoy a
                  marvelous time with loved ones. We welcome people from all
                  over the world. Hosts love to meet Guests, get to know each
                  other, and forge friendships together with people with whom
                  there is instantly something in common, the love of aviation.
                  The community <strong>Members</strong> love to share stories,
                  share culture, and learn about each other. We protect our
                  tight-knit community from anyone who threatens the peace,
                  safety, and satisfaction of our beloved Members. FlyInn
                  reserves the right to remove any individual from our community
                  who does not adhere to these principles.
                </p>
                <p>
                  This agreement, as outlined in the <strong>Terms</strong>, is
                  effective when you access the <strong>Platform</strong> and
                  continues to be in effect active until either you or FlyInn
                  decide to terminate it based on the conditions specified in
                  these Terms.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  FRAUDULENT AND SUSPICIOUS ACTIVITY
                </h2>
                <p>
                  FlyInn only accepts <strong>credit or bank cards</strong> on
                  the
                  <strong>Platform</strong> for transactions or any other
                  matter. If any <strong>Member</strong> requests that you use
                  any other form of payment, especially{" "}
                  <strong>cash or a wire transfer</strong>, please call FlyInn
                  immediately. We are not liable nor do we take on the
                  responsibility to help Members avoid
                  <strong>fraud</strong> or being scammed.
                </p>
                <p>
                  Any violation of this provision may result in immediate
                  termination and removal of the <strong>Listing</strong>
                  and/or the <strong>Member’s</strong> account.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  SUGGESTIONS AND FEEDBACK
                </h2>
                <p>
                  We consider your <strong>feedback</strong> positive, neutral,
                  or negative, to be a private review you leave us. We consider
                  your <strong>suggestions</strong> a kind gesture. We thank you
                  deeply for both because they show us how much you care to make
                  the Community and the <strong>Platform</strong> a place you
                  can be proud to “Fly-Inn and stay a while!”
                </p>
                <p>
                  Please keep your <strong>suggestions</strong> and{" "}
                  <strong>feedback</strong>
                  coming! We always love to hear from you! Just bear in mind
                  that many of our <strong>Users</strong> and employees submit
                  suggestions and to avoid confusion in case any ideas seem
                  similar to ideas you may have submitted, the following policy
                  must apply:
                </p>
                <p>
                  If you give us any <strong>suggestions</strong> or{" "}
                  <strong>feedback</strong>, we reserve the right to utilize
                  them <strong>without any compensation to you</strong>; without
                  any restriction; and without any obligation to you to review
                  them, consider them, or keep them confidential. This will hold
                  even if you assert otherwise. You agree that we will own all
                  rights to anything we create based on your suggestions or
                  feedback.
                </p>
                <p>
                  You may submit your <strong>suggestions</strong> and{" "}
                  <strong>feedback</strong>
                  by sending us an email to&nbsp;
                  <CustomLink to="mailto:pic@fly-inn.com">
                    PIC@fly-inn.com
                  </CustomLink>
                  , and writing “Suggestions” or “Feedback” on the subject line.
                  You may also use our contact form on our contact page and
                  write “Suggestions” or “Feedback” on the subject line.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  HOW SEARCHES ARE PERFORMED
                </h2>
                <p>
                  <strong>Hosts: </strong>When Hosts submit a
                  <strong>Listing</strong>, they can set whatever parameters and
                  criteria will most accurately describe their{" "}
                  <strong>Rental Property</strong>. In addition to describing
                  their Rental Property in their own words, they can choose from
                  a multitude of different pre-set criteria to describe their
                  Offerings in their Listing. The search criteria include an
                  abundance of amenities, type of space, type of dwelling,
                  number of bedrooms and bathrooms, price, etc.
                  <br />
                  <strong>Users: </strong>Once the <strong>Listing</strong> has
                  been published, Users will search based on their destination,
                  Listing type, arrival and departure dates, number of guests,
                  etc.
                </p>
                <p>
                  Search results will display according to the criteria the{" "}
                  <strong>Users</strong> used to conduct their search and the
                  parameters they set. In addition, once their search results
                  have been returned to them, they have the option of sorting
                  their search results into the following methods of display:{" "}
                  <strong>Default</strong>, <strong>Price</strong>
                  (low to high), <strong>Price</strong> (High to low),{" "}
                  <strong>Rating</strong>,<strong>Featured First</strong>,{" "}
                  <strong>Date</strong> (old to new), <strong>Date</strong>
                  (new to old).
                </p>
                <p>
                  <strong>Featured First</strong> displays the Listings of Hosts
                  who
                  <strong>paid an additional fee</strong> to have their property
                  displayed in search results, the Home Page, or other places on
                  the <strong>Platform</strong>. Spots are filled every Monday
                  at 12:01 a.m. from a pool of Listings by Hosts who have
                  previously submitted a method of payment for the service.
                  Hosts are selected by lottery and their credit card is charged
                  the moment they are selected and their property is featured on
                  the Platform. The lottery is per property, not per Host.
                </p>
                <p>
                  If <strong>Users</strong> don’t select an alternative display
                  method, the <strong>Platform</strong> defaults to the “
                  <strong>Default</strong>” display method. The way those{" "}
                  <strong>Listings</strong> appear is based on a wide range of{" "}
                  <strong>determinants</strong>, directly or indirectly and
                  they, include but are not limited to, the quality of the{" "}
                  <strong>Rental Property</strong>; how long it takes for a{" "}
                  <strong>Host</strong> to respond to an inquiry; the
                  <strong>Listing’s price</strong>; how many hits the Listing
                  receives; how many times the Listing has been viewed, loved,
                  and saved; the quality of the Listing itself including the
                  quantity and quality of photography; how long ago the Listing
                  was posted on the Platform; calendar availability; minimum and
                  maximum number of nights the Host allows; check-in and
                  check-ot time; the number of positive reviews the Listing has
                  received; the number of positive reviews the Host has
                  received; the status the Host has earned on the Platform; the
                  type of <strong>Offering</strong> the Host provides; how many
                  bookings the Listing has received; how easy it is to book the
                  Listing; and more.
                </p>
                <p>
                  <strong>Keep in mind: </strong>
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    We cannot ensure the order in which your{" "}
                    <strong>Listing</strong>
                    will appear in search results on the{" "}
                    <strong>Platform</strong>.
                  </li>
                  <li>
                    Search results and order may differ in appearance from
                    mobile app to website to map view.
                  </li>
                  <li>
                    Depending on which search criteria different
                    <strong>Users</strong> employ, the listing order may differ
                    for each search, even if the search is conducted by the same
                    User.
                  </li>
                  <li>
                    In order for <strong>Members</strong> to better enjoy a more
                    effective experience in searching, we reserve the right to
                    optimize our <strong>Default</strong> results in order to
                    enhance the experience of the entire community by using
                    different search algorithms; and to run occasional tests on
                    our optimization.
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CHANGES TO THE PLATFORM
                </h2>
                <p>
                  We reserve the right to make{" "}
                  <strong>any change to the Platform</strong>, at any time and
                  in our sole discretion.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CHANGES AND CANCELATIONS TO BOOKINGS
                </h2>
                <p>
                  <strong>Changes: </strong>Hosts and Guests are responsible and
                  liable for any changes to any booking they choose to make
                  after the booking has been finalized (as evidenced by payment
                  processed). The change can either be made on the{" "}
                  <strong>Platform</strong> or called in for FlyInn’s customer
                  service for a team member to make the change. In the event of
                  a booking change, Hosts and Guests are responsible for paying
                  any additional amounts applicable to them including a change
                  in the Listing Price, and any fees or taxes associated.
                </p>
                <p>
                  <strong>Cancellations: </strong>Hosts and Guests should not
                  cancel a booking without a valid reason to do so. Canceling
                  reservations without a good reason undermines the integrity,
                  cohesiveness, and trust in our Community. Please be sure of
                  your reservation details before creating a booking.
                </p>
                <p>
                  <strong>If A Host Cancels A Booking: </strong>
                  The amount we refund or pay the <strong>Guest</strong>, and
                  all other reasonable costs we may incur due to the
                  cancellation will be deducted from your disbursement amount.
                </p>
                <p>
                  <strong>If A Guest Cancels A Booking: </strong>
                  If a <strong>Guest</strong> cancels a booking, any amount
                  disbursed to the <strong>Host</strong> is based upon the
                  cancellation policy set in the <strong>Listing</strong>. If a
                  Guest receives a refund after you have already received a
                  disbursement for the booking, or if the amount paid to the
                  Guest is greater than your disbursement, FlyInn may deduct the
                  amount from your future disbursements.
                </p>
                <p>
                  <strong>Additional: </strong>FlyInn’s <strong>Terms</strong>
                  supersede the cancellation policy <strong>Hosts</strong> set
                  in cases where Hosts permit the cancellation of a reservation
                  and/or allow Guests to get a refund. To appeal, please send us
                  an email at&nbsp;
                  <CustomLink to="mailto:appeals@fly-inn.com">
                    appeals@fly-inn.com
                  </CustomLink>
                  , or contact us via the form on our Contact page, subject line
                  “Appeals”. If we anticipate with good reason that we will be
                  providing a refund to a guest in accordance with one of these
                  policies, we may postpone any disbursement for that booking
                  until a decision regarding the refund has been reached.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  HOSTS
                </h2>
                <p>
                  <strong>Who is a Host? </strong>A <strong>Host</strong> is
                  anyone to whom FlyInn extends a <strong>license</strong> (see
                  the License section above) to use the{" "}
                  <strong>Platform</strong> with strict adherence to these{" "}
                  <strong>Terms</strong> in order to share their
                  <strong>Offerings</strong>, with our tight-knit community of
                  aviation enthusiasts. A Host may own the{" "}
                  <strong>Rental Property</strong>, manage it, or act as an
                  agent to the owner. A Host may be an individual, team,
                  business, or other entity. A Host is a{" "}
                  <strong>
                    business owner and/or operator or manager
                    <strong> and as such, is </strong>solely responsible and
                    liable
                  </strong>{" "}
                  under these Terms for the acts and omissions of anyone who
                  works under or for the Host’s organization in an effort to
                  provide the Offerings that are offered in the Host’s{" "}
                  <strong>Listings</strong>.
                </p>
                <p>
                  <strong>Independent Contractors: </strong> We have an
                  <strong>independent contractor relationship</strong> with
                  Hosts and an employer and employee, partnership, joint
                  venture, agency, or franchiser and franchisee relationship is
                  <strong>not intended or created</strong> by these{" "}
                  <strong>Terms</strong> or when you use the{" "}
                  <strong>Platform</strong> as a <strong>Host</strong>. Your
                  hosting is your business. We do not participate in its
                  management, nor do we decide your schedule, pricing, or
                  conditions for extending services.
                </p>
                <p>
                  <strong>
                    Do Hosts or Guests contract with FlyInn when they rent a
                    property on the Platform?{" "}
                  </strong>
                  <strong>No</strong>. When you create a booking with and for
                  your
                  <strong>Guest</strong>, you are creating and entering into a
                  <strong>contract with that Guest</strong>. Your
                  responsibilities include, but are not limited to, honoring the
                  terms you have set in your <strong>Listing</strong> including,
                  price, cancellation policy, amenities offered, and accuracy in
                  representing the property through writing and photos.
                  Separately, you are contracting with us that you agree and
                  consent that we will be deducting anything owed to us from
                  your disbursement.
                </p>
                <p>
                  <strong>
                    Can Hosts have their own, supplementary contracts with
                    Guests?{" "}
                  </strong>
                  <strong>Yes</strong>, as long as all terms or conditions in
                  your supplementary contracts are in agreement with FlyInn’s
                  <strong>Terms</strong> and you have as one of your photos the
                  entire supplementary agreement, without any changes, and with
                  any identifying information such as names and addresses,{" "}
                  <strong>OMITTED</strong> in the photo. Should any terms in
                  your supplemental contracts be in contradiction to any of our{" "}
                  <strong>Terms</strong>, ours shall supersede.
                </p>
                <p>
                  <strong>What requirements do Hosts have? </strong>
                  First and foremost, <strong>Hosts</strong>, you represent that
                  you comprehend and warrant that you will adhere to any laws,
                  rules, regulations, ordinances, and any contracts with third
                  parties that are applicable to your <strong>Listings</strong>.
                </p>
                <p>
                  As owners of your own business, you as a <strong>Host</strong>{" "}
                  are
                  <strong>completely responsible and liable</strong> for your
                  own acts and omissions and those of any of their associates in
                  your business. We explicitly disclaim any and all liability
                  arising from the purported accuracy of any{" "}
                  <strong>Listing’s Content</strong> submitted by Hosts, or any
                  purported breaches of contract by either Host or Guest. Hosts
                  are required to adhere to our standards which include, but are
                  not limited to the following:
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    Your <strong>Listing</strong> must be{" "}
                    <strong>current</strong>, <strong>complete</strong>,
                    <strong>honest</strong>, <strong>accurate</strong>, and{" "}
                    <strong>not misleading</strong> in any way. This standard
                    applies to everything you create into the Listing such as
                    the title, description, photography, amenities, location,
                    availability, the house rules and requirements you set, the
                    price you set, all associated fees along with a description
                    thereof, offline fees, and taxes
                  </li>
                  <li>
                    You are <strong>responsible</strong> and{" "}
                    <strong>liable</strong> for all
                    <strong>Content</strong> you submit and/or omit in your
                    <strong>Listing</strong> which must be in agreement with our
                    <strong>Terms</strong>
                  </li>
                  <li>
                    You are <strong>responsible</strong> and{" "}
                    <strong>liable</strong> for
                    <strong>remitting your own taxes</strong> to the appropriate
                    agencies. You may not collect any other fees or charges off
                    the <strong>Platform</strong> without express written
                    permission from FlyInn, except fees covered in our&nbsp;
                    <CustomLink to="/Off-the-Platform-Fees-Policy">
                      Off-the-Platform Fees Policy
                    </CustomLink>
                    &nbsp;
                  </li>
                  <li>
                    You must keep all matters that pertain to the
                    <strong>transaction on the Platform</strong> and may not
                    engage in any actions outside the Platform
                  </li>
                  <li>
                    Your <strong>calendar</strong> must be{" "}
                    <strong>accurate and current</strong>
                    at all times
                  </li>
                  <li>
                    You must obtain the proper&nbsp;
                    <CustomLink to="/short-term-rental-insurance">
                      insurance
                    </CustomLink>
                    &nbsp;for your <strong>rental property</strong> and all
                    personal property you may be renting along with it. We
                    recommend that you thoroughly examine the&nbsp;
                    <CustomLink to="/short-term-rental-insurance">
                      insurance
                    </CustomLink>
                    &nbsp;policy’s terms and conditions, which include coverage
                    details and exclusions. This includes our{" "}
                    <CustomLink to="/courtesy-rental-peer-to-peer-car-sharing-policy">
                      Courtesy, Rental, Peer-to-Peer and Car-Sharing{" "}
                    </CustomLink>
                    <CustomLink to="/courtesy-rental-peer-to-peer-car-sharing-policy">
                      Policy
                    </CustomLink>
                    . Both the&nbsp;
                    <CustomLink to="/short-term-rental-insurance">
                      Short-Term Rental Insurance guidelines
                    </CustomLink>
                    &nbsp;and the Courtesy, Rental, Peer-to-Peer and Car-Sharing
                    Policy are incorporated herein by reference.&nbsp;
                  </li>
                  <li>
                    You agree to adhere to your <strong>common sense</strong>{" "}
                    and
                    <strong>good customer service</strong> when handling your
                    business. This includes but is not limited to responding to
                    a reasonable number of requests for bookings in a reasonably
                    timely manner.
                  </li>
                  <li>
                    In addition, you may not cancel an unreasonably large
                    percentage of accepted bookings
                  </li>
                  <li>
                    Each <strong>Listing</strong> must correspond to only one
                    <strong>Space</strong> “Space”. Each Space may only have one
                    rental agreement in place for one party at a time. A Space
                    may be as small as a bed within a room, notwithstanding,
                    that bed and the small space it occupies constitutes the
                    Space you are renting and may not be rented to any other
                    person or entity at the same time
                  </li>
                  <li>
                    <strong>Hosts</strong> may not remove the original{" "}
                    <strong>Space</strong> from a <strong>Listing</strong> and
                    replace it with another Space, without{" "}
                    <strong>express written consent</strong> from FlyInn
                  </li>
                  <li>
                    Should we grant the authorization to replace a
                    <strong>Space</strong> in a <strong>Listing</strong>, if the
                    replacement Space changes the listing so much that it seems,
                    in our sole discretion, to be another property altogether,
                    we reserve the right to terminate the listing
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  TERMINATION OF LISTINGS
                </h2>
                <p>
                  We aim to make Fly-Inn.com a place where all{" "}
                  <strong>Users</strong>
                  can feel safe, satisfied, and comfortable. In order to ensure
                  this, we reserve the right to any of the following remedies
                  including, but not limited to, editing or modifying any
                  information that may be false, inaccurate, or misleading,
                  restricting the
                  <strong>Host’s</strong> use of the <strong>Platform</strong>,
                  affect the position in which the Host’s{" "}
                  <strong>Listing(s)</strong> appear in search results, remove a
                  Listing from the search results, and/or{" "}
                  <strong>terminate a Listing</strong>, immediately and without
                  notice to the Host if, in our sole discretion, the Host:
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    Abuses the <strong>Platform</strong>
                  </li>
                  <li>
                    Causes disturbances or disrupts the community where the{" "}
                    <strong>Listing</strong> is situated, or causes a disruption
                    in or on the <strong>Rental Property</strong> itself
                  </li>
                  <li>
                    Participates in any practice that, at our sole discretion,
                    would be deemed misleading, unjust, or inappropriate
                  </li>
                  <li>
                    Uploads inappropriate content to our{" "}
                    <strong>Platform</strong> or into our database
                  </li>
                  <li>
                    Submits <strong>Content</strong> for a{" "}
                    <strong>Listing</strong> and such Content violates the
                    rights of a third party
                  </li>
                  <li>Fails to comply with local rental regulations</li>
                  <li>
                    Engages in abusive or offensive behavior towards any FlyInn
                    employee or representative
                  </li>
                  <li>
                    Books a <strong>Rental Property</strong> for more than one
                    <strong>Guest</strong> on the same date
                  </li>
                  <li>
                    Significantly breaches these <strong>Terms</strong>.
                  </li>
                </ol>
                <p>
                  We are not obligated to look into any complaints submitted by
                  other <strong>Users</strong>.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  HOSTS’ TAXES
                </h2>
                <p>
                  As a <strong>Host</strong>, you are a{" "}
                  <strong>
                    business owner and/or operator or manager
                    <strong> and you are </strong>solely responsible
                  </strong>{" "}
                  for ensuring you are in compliance with all governmental
                  agencies in regards to <strong>Taxes</strong>. Before you
                  create your <strong>Listing</strong> you are responsible for
                  contacting all jurisdictions to determine the type of tax you
                  are required to collect and the percentage for each tax. Be
                  sure you include in your price any
                  <strong>Value Added Tax (VAT)</strong> and any other
                  applicable tax such as occupancy taxes, tourist taxes, etc.
                  You are
                  <strong>solely responsible</strong> for calculating the total
                  amount and writing that amount into your{" "}
                  <strong>Listing</strong>. You are{" "}
                  <strong>solely responsible</strong> for then collecting the
                  appropriate tax, which is easily done when your
                  <strong>Guest</strong> pays at checkout, if the jurisdiction
                  allows FlyInn to collect it on your behalf, (USA allows it).
                  Some jurisdictions require us to withhold{" "}
                  <strong>Taxes</strong>
                  from disbursements we make to you. Unless a jurisdiction
                  requires from us otherwise, we forward all collected tax to
                  you as part of your disbursement for each transaction.
                  Finally, you are responsible for
                  <strong>remitting and reporting the Taxes</strong> associated
                  with your <strong>Listing</strong>, as well as your income
                  tax, when you file with the appropriate agencies.
                  Collectively, all Taxes mentioned in this paragraph shall
                  herein be referred to as “<strong>Taxes</strong>”. Please be
                  aware that some jurisdictions require us to collect and, in
                  some cases, report Tax information about you.
                </p>
                <p>
                  If the jurisdiction allows FlyInn to collect{" "}
                  <strong>Taxes</strong>
                  on behalf of <strong>Hosts</strong>, you hereby authorize
                  FlyInn to act on your behalf to collect Taxes. We reserve the
                  right to discontinue collecting Taxes in any jurisdiction, for
                  any reason, at our option, upon prior notice. Any{" "}
                  <strong>Taxes</strong> that are collected by FlyInn are
                  identified to <strong>Members</strong> on their transaction
                  records, as applicable.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  USING THIRD-PARTY WEBSITES TO GET HOSTS’ LISTINGS MORE
                  EXPOSURE
                </h2>
                <p>
                  We may share your{" "}
                  <strong>Listing’s Content/information</strong>
                  and facilitate the exposure of your <strong>
                    Listing
                  </strong>{" "}
                  on a<strong>third-party website</strong> with the end goal of
                  affording
                  <strong>Members</strong> to gain wider exposure for their
                  properties. Any additional terms and conditions that may apply
                  to said distributions may be communicated to you via email.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  PROOF OF OWNERSHIP OR AUTHORIZATION
                </h2>
                <p>
                  <strong>Hosts</strong>, you{" "}
                  <strong>represent and warrant</strong> that you
                  <strong>legally own</strong> the{" "}
                  <strong>Rental Property</strong> that you list on the{" "}
                  <strong>Platform</strong> or that you have all the necessary
                  <strong>rights and authority</strong> from the owner of the
                  Rental Property to rent and offer to rent the same.
                </p>
                <p>
                  We reserve the right to ask you to provide and you agree to
                  expeditiously supply us with any or all of the following:
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    <strong>Proof of ownership</strong> or proof that you have
                    all the necessary <strong>rights and authority</strong> from
                    the owner of the <strong>Rental Property</strong> to rent
                    and offer to rent the Rental Property you list on the
                    <strong>Platform</strong>
                  </li>
                  <li>Personal identification</li>
                  <li>
                    Proof that all <strong>Content</strong> supplied to us as
                    part of the description of the <strong>Listing</strong>,
                    whether it be writing or photography accurately and
                    completely describes the <strong>Rental Property</strong> in
                    the Listing.
                  </li>
                </ol>
                <p>You commit to</p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    Describing each <strong>Rental Property</strong> you list on
                    the
                    <strong>Platform</strong> <strong>accurately</strong>,{" "}
                    <strong>truthfully</strong>, and
                    <strong>completely</strong>
                  </li>
                  <li>
                    Periodically reviewing for accuracy the{" "}
                    <strong>Content</strong>
                    of your <strong>Listing</strong> and its location and
                    comparing it to our geographic descriptors, and promptly
                    doing so upon our request
                  </li>
                  <li>
                    Disclosing any <strong>material defect</strong> the{" "}
                    <strong>Rental Property</strong> may have
                  </li>
                  <li>
                    Disclosing any <strong>material information</strong> about
                    the
                    <strong>Rental Property</strong>
                  </li>
                  <li>
                    Ensuring you are in compliance with all governmental
                    agencies and these <strong>Terms</strong>
                  </li>
                  <li>
                    Keeping your <strong>calendar accurate and current</strong>{" "}
                    at all times
                  </li>
                  <li>
                    Acquiring and holding current&nbsp;
                    <CustomLink to="/short-term-rental-insurance">
                      insurance
                    </CustomLink>
                    &nbsp;coverage adequate to safeguard against loss associated
                    with your property, any physical injury to{" "}
                    <strong>Guests</strong>, etc.
                  </li>
                  <li>
                    Granting your current <strong>Guests</strong> access to the
                    <strong>Rental Property</strong>
                  </li>
                  <li>
                    Reimbursing FlyInn promptly for any amount paid to a
                    <strong>Guest</strong> on your behalf and in our sole
                    discretion for any loss a Guest has incurred. FlyInn
                    reserves the right to pursue you for any amounts we have
                    paid on your behalf toward the recovery of the Guest’s loss.
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  INSURANCE FOR HOSTS
                </h2>
                <p>
                  As <strong>Independent Contractors</strong>,{" "}
                  <strong>Hosts</strong> own their own business. FlyInn
                  disclaims all liability for any damages, claims etc. that may
                  arise from the activities of Hosts and Guests in relation to
                  the booking of <strong>Listings</strong>. Hosts are{" "}
                  <strong>solely responsible for acquiring</strong>&nbsp;
                  <CustomLink to="/short-term-rental-insurance">
                    insurance
                  </CustomLink>
                  &nbsp;coverage adequate to safeguard their properties, any
                  physical injury to Guests, etc.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  HOST ASSUMPTION OF RISK
                </h2>
                <p>
                  You recognize that there are{" "}
                  <strong>
                    foreseeable and unforeseeable risks<strong>, </strong>
                    dangers<strong>, and </strong>hazards
                  </strong>
                  directly or inherently involved in your participation in
                  accessing and using the <strong>Platform</strong> and any
                  <strong>Content</strong> (see the Content section above);
                  booking, renting, and offering to rent or sell any{" "}
                  <strong>
                    Rental Property<strong> and any other </strong>Goods
                    <strong>, </strong>Services
                  </strong>{" "}
                  or
                  <strong>Offerings</strong> you have published on the Platform
                  (<strong>Listings</strong>); or any interaction or
                  communication you may have with your <strong>Guests</strong>{" "}
                  or any other
                  <strong>Member</strong> of the Platform either on the Platform
                  or in person (collectively “<strong>Activity</strong>”); you
                  recognize that FlyInn has <strong>no control</strong> over
                  such risks, dangers and hazards and makes{" "}
                  <strong>no representations of safety</strong>. You further
                  acknowledge that you have full knowledge of the facts and
                  circumstances associated with your participation in this
                  Activity, you have had the possibility and opportunity to
                  probe into the Platform to gain such knowledge which includes
                  but is not limited to any laws, rules, regulations, ordinances
                  and any <strong>Terms</strong>, terms, rules, standards,
                  policies, and requirements obligations that may pertain to
                  your Activity, and that You are not basing your actions on any
                  legal statements made by FlyInn. . If you choose to
                  participate in any <strong>Activity</strong>, you
                  <strong>voluntarily</strong>, to the fullest extent permitted
                  by applicable law,{" "}
                  <strong>assume all responsibility and risk</strong>
                  arising out of your participation in said Activity, including
                  but not limited to all risk of loss of limb or life; physical
                  and emotional injuries; disability; serious illness such as
                  infectious and non-infectious diseases and/or conditions
                  arising from your participation or associated with developing
                  or pre-existing conditions, accidents, property damage, injury
                  to others, and other hazards.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  GUESTS
                </h2>
                <p>
                  <strong>Who is a Guest? </strong>A <strong>Guest</strong> is
                  an individual to whom FlyInn extends a{" "}
                  <strong>license</strong> (see #2A above) to use the{" "}
                  <strong>Platform</strong> with strict adherence to these{" "}
                  <strong>Terms</strong> in order to, among other things, rent a{" "}
                  <strong>Rental Property</strong> from a Host. See the
                  definition of who is a Host in the Host section above.
                </p>
                <p>
                  <strong>
                    Do Guests or Hosts contract with FlyInn when they rent a
                    property on the Platform?{" "}
                  </strong>
                  <strong>No</strong>. When a <strong>Host</strong> creates a
                  booking for a<strong>Rental Property</strong> “Rental Property
                  Booking” with and for you, you are entering into a{" "}
                  <strong>
                    contract with that Host
                    <strong>. The contract terms encompass these </strong>Terms
                  </strong>
                  , all terms set forth in the booking, including but not
                  limited to the <strong>cancellation policy</strong>, and any
                  other policies, rules, guidelines, standards, or requirements
                  specified in the <strong>Listing</strong> or at checkout that
                  pertain to the booking. Be sure you fully understand all of
                  the aforementioned <strong>Terms</strong>
                  before you book a Listing.
                </p>
                <p>
                  A <strong>Rental Property Booking</strong> is a{" "}
                  <strong>
                    limited license<strong>, and the licensee, the </strong>
                    Guest
                  </strong>
                  , is granted permission to <strong>enter</strong>,{" "}
                  <strong>occupy</strong>, and <strong>use</strong> all or part
                  of the property on a <strong>non-exclusive basis</strong>,
                  meaning the Host or others the Host chooses are also allowed
                  to use the property at the same time. The
                  <strong>Host</strong> agrees neither the Host nor others will
                  enter the <strong>Space</strong> he has rented to you during
                  the period of your Rental Property Booking, but reserves the
                  right to do so, if reasonably necessary, or allowed by law
                  pertaining to the Rental Property Booking, or allowed by your
                  agreement with the Host. You agree to occupy the Space until
                  no later than the checkout time in the{" "}
                  <strong>Listing</strong>. If you <strong>overstay</strong>,
                  the Host reserves the right to induce you to leave by imposing
                  <strong>reasonable penalties</strong> and any other means
                  legally available to the Host.
                </p>
                <p>
                  <strong>
                    What requirements and responsibilities do Guests have?{" "}
                  </strong>
                  Your requirements and responsibilities under the terms of your
                  contract with the Host include, but are not limited to,
                  honoring the terms set in the <strong>Listing</strong>
                  including
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    Paying all the charges you see at checkout such as all
                    rental fees, our <strong>service fee</strong>,&nbsp;
                    <span>
                      <span>
                        <CustomLink to="/Off-the-Platform-Fees-Policy">
                          Off-the-Platform Fees
                        </CustomLink>
                      </span>
                    </span>
                    , and <strong>taxes</strong> associated with your booking
                  </li>
                  <li>
                    Agreeing that FlyInn may, charge your chosen
                    <strong>Payment Method</strong> that you booked the Listing
                    with, to collect any amounts owed due to{" "}
                    <strong>Damages</strong> (as defined in the Addressing
                    Damage Complaints section) to the Host
                  </li>
                  <li>
                    Treating your <strong>Host</strong> and others with{" "}
                    <strong>respect</strong>
                  </li>
                  <li>
                    Ensuring that you and all your guests, treat the
                    <strong>Rental Property</strong> and all pertaining personal
                    property with <strong>respect</strong> and in the condition
                    it was delivered to you
                  </li>
                  <li>
                    Ensuring that you do not exceed the{" "}
                    <strong>
                      maximum number of Guests<strong> allowed in the </strong>
                      Listing
                    </strong>
                  </li>
                  <li>
                    Adhering to all <strong>applicable laws</strong>,
                    regulations, rules, and ordinances at all times.
                  </li>
                </ol>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  INSURANCE FOR GUESTS
                </h2>
                <p>
                  <strong>Guests</strong> are{" "}
                  <strong>
                    solely responsible for acquiring insurance coverage
                  </strong>{" "}
                  adequate to safeguard their trip, possessions, health, and
                  life. <strong>Members</strong> must show proof, upon our
                  request, that they have acquired adequate insurance coverage
                  before any booking can take place. Acquiring insurance is very
                  quickly, efficiently and easily accomplished online from
                  numerous insurance companies if you simply conduct a search
                  for short-term rental insurance or traveler insurance. The
                  amount of time it takes will in no way constitute a reason to
                  be absolved of this obligation. Members further agree that
                  they will keep their insurance in good standing throughout the
                  entire booking period.
                </p>
                <p>
                  You are <strong>completely responsible and liable</strong> for
                  your own acts and omissions and those of any guest you allow
                  to access the <strong>Rental Property</strong> including all
                  <strong>Common Areas</strong>. All spaces and amenities
                  associated with the Rental Property’s location that both the
                  Host and Guest have lawful access to use in relation to the
                  Rental Property are herein referred to as (“
                  <strong>Common Areas</strong>”), We explicitly disclaim any
                  and all liability arising from the acts and omissions of any
                  <strong>Guest</strong>, or any purported breaches of contract
                  by either Host or Guest. Hosts are required to adhere to our
                  standards. Before booking a <strong>Listing</strong>, it’s
                  your responsibility to thoroughly read and comprehend the
                  terms of the contract, which include these{" "}
                  <strong>Terms</strong>
                  as well as all terms of the <strong>Reservation</strong>,
                  encompassing all rules, standards, policies, guidelines and
                  requirements.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ACCOUNT TERMINATION OR SUSPENSION
                </h2>
                <p>
                  You may <strong>terminate</strong> these{" "}
                  <strong>Terms</strong> at any time and for any reason by{" "}
                  <strong>deleting your FlyInn account</strong>. Terminating
                  your FlyInn account automatically cancels any confirmed
                  booking(s) you may have. Your <strong>Guests</strong>
                  will be issued a <strong>full refund</strong>. Terminating
                  your account also automatically cancels any confirmed
                  booking(s) you may have and the refund you receive, if any,
                  will be dependent upon the terms your <strong>Host</strong>
                  set at the time you booked. Be sure to take screenshots, make
                  backups, or take other necessary precautions as deleting your
                  account also deletes all of your data. We assume no
                  responsibility for storing your data.
                </p>
                <p>
                  <strong>Members</strong> whose accounts we have{" "}
                  <strong>terminated</strong> or
                  <strong>suspended</strong> are <strong>prohibited</strong>{" "}
                  from registering a new account or using another Member’s
                  account to enter or use the <strong>Platform</strong>, or
                  circumvent the suspension or termination in any other way. We
                  may terminate these <strong>Terms</strong> and{" "}
                  <strong>
                    terminate or suspend your account
                    <strong> if you fail to adhere to these </strong>Terms
                  </strong>
                  , any applicable law, or for any other reason. Though we can’t
                  guarantee it, we will make an effort to provide you with{" "}
                  <strong>reasonable notice</strong> before your account is
                  terminated. We reserve the right to terminate these
                  <strong>Terms</strong>, immediately and without notice, and
                  stop providing you with the ability to access the
                  <strong>Platform</strong> or any or all functions the Platform
                  provides, including but not limited to hide
                  <strong>Listings</strong>, cancel all bookings, and hide
                  reviews. We may terminate your account without prior notice
                  due to a prolonged inactivity of{" "}
                  <strong>more than two years</strong>. We reserve the right to
                  recycle your username at any time and for any reason. Where we
                  terminate or suspend your access to the{" "}
                  <strong>Platform</strong> for having violated our community
                  standards, or where we deem in our sole discretion that the
                  violation was small, rare, infrequent, caused no significant
                  amount of damage, or held no malicious intent, we will give
                  you notice and provide an opportunity for you to{" "}
                  <strong>appeal</strong> and/or resolve the matter.
                </p>
                <p>
                  To rectify the matter and/or <strong>appeal</strong>, please
                  send us an email at&nbsp;
                  <CustomLink to="mailto:appeals@fly-inn.com">
                    appeals@fly-inn.com
                  </CustomLink>
                  , or contact us via the form on our Contact page, subject line
                  “Appeals”. In the event of a reservation cancellation pursuant
                  to this section of the
                  <strong>Terms</strong>, we will decrease the payment to the
                  <strong>Host</strong> by the <strong>refund</strong> or
                  compensation provided to the <strong>Guest</strong>, plus any
                  additional costs incurred by us or the Host due to the
                  cancellation. In addition to the disciplinary measures we have
                  listed above, FlyInn reserves the right to undertake any
                  actions it deems reasonably necessary to adhere to the law;
                  and any order or request issued by a court of law, law
                  enforcement, or other offices of the government under the
                  applicable jurisdictions.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  GUEST ASSUMPTION OF RISK
                </h2>
                <p>
                  You recognize that there are{" "}
                  <strong>
                    foreseeable and unforeseeable risks<strong>, </strong>
                    dangers<strong>, and </strong>hazards
                  </strong>
                  directly or inherently involved in your participation in
                  accessing and using the <strong>Platform</strong> and any
                  <strong>Content</strong> (see the Content section), booking
                  and staying at any <strong>Rental Property</strong>, making
                  use of any other <strong>Offering</strong> or{" "}
                  <strong>Listing</strong> a <strong>Host</strong> provides, or
                  any interaction or communication you may have with the Host or
                  any other <strong>Member</strong> of the Platform either on
                  the Platform or in person (collectively “
                  <strong>Activity</strong>”); you recognize that FlyInn has{" "}
                  <strong>no control</strong> over such risks, dangers and
                  hazards and makes{" "}
                  <strong>no representations of safety</strong>. You further
                  acknowledge that you have full knowledge of the facts and
                  circumstances associated with your participation in this
                  Activity, you have had the possibility and opportunity to
                  probe into the Platform to gain such knowledge which includes
                  but is not limited to any laws, rules, ordinances, and
                  regulations, any
                  <strong>Terms</strong>, rules, standards, policies, and
                  requirements obligations that may pertain to your
                  <strong>Activity</strong> and that you are not basing your
                  actions on any legal statements made by FlyInn. If you choose
                  to participate in such <strong>Activity</strong>, you
                  <strong>voluntarily</strong>, to the fullest extent permitted
                  by applicable law,{" "}
                  <strong>assume all responsibility and risk</strong>
                  arising out of your participation in all Activity, including
                  but not limited to all risk of loss of limb or life; physical
                  and emotional injuries; disability; serious illness such as
                  infectious and non-infectious diseases and/or conditions
                  arising from your participation or associated with developing
                  or pre-existing conditions, accidents, property damage, injury
                  to others, and other hazards. This implies that you’re
                  accountable for examining a <strong>Listing</strong> or
                  <strong>Offering</strong> to ensure it fits your needs. By
                  agreeing, you acknowledge that you’ve had the chance to
                  research the <strong>Platform</strong> and any relevant laws,
                  rules, regulations, or obligations pertaining to your
                  <strong>Listings</strong> or <strong>Offerings</strong>. You
                  also confirm that you’re not depending on any legal statement
                  made by FlyInn.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  DISCLAIMER OF WARRANTIES
                </h2>
                <p>
                  <strong>
                    THE PLATFORM AND ALL CONTENT ARE PROVIDED “AS IS” AND, TO
                    THE MAXIMUM EXTENT PERMITTED BY LAW, WITHOUT REPRESENTATION
                    OR WARRANTY OF ANY KIND EITHER EXPRESS OR IMPLIED, INCLUDING
                    BUT NOT LIMITED TO, REPRESENTATIONS OR WARRANTIES THAT THE
                    PLATFORM WILL ALWAYS FUNCTION WITHOUT DELAYS, DISRUPTIONS,
                    INTERRUPTIONS, OR IMPERFECTIONS; THAT THE PLATFORM WILL
                    ALWAYS PERFORM IN A SECURE, ERROR-FREE, OR TIMELY MANNER;
                    THAT ANY CONTENT OR INFORMATION, USER-PROVIDED OR OTHERWISE,
                    YOU OBTAIN ON OR THROUGH THE PLATFORM WILL BE ERROR-FREE OR
                    TIMELY; THAT ANY VERIFICATION PROCESS INCLUDING BACKGROUND
                    CHECKS AND PERSONAL IDENTITY WE MAY CONDUCT ON MEMBERS WILL
                    REVEAL PRIOR MISBEHAVIOR OR DETER FUTURE WRONGDOING; THAT
                    ANY VERIFICATION PROCESS WE MAY CONDUCT ON A LISTING WILL
                    REVEAL ITS ACCURACY, NON-INFRINGEMENT, MERCHANTABILITY, OR
                    FITNESS FOR A PARTICULAR PURPOSE; OR ENDORSEMENT OF THE
                    EXISTENCE, CONDUCT, PERFORMANCE, SAFETY, QUALITY, LEGALITY
                    OR SUITABILITY OF ANY MEMBER OR THIRD PARTY; OR THE
                    EXISTENCE, CONDUCT, PERFORMANCE, SAFETY, QUALITY, LEGALITY
                    OR SUITABILITY OF ANY OFFERING OR LISTING.
                  </strong>
                </p>
                <p>
                  By “<strong>Verified</strong>” when referring to a{" "}
                  <strong>Member</strong> or
                  <strong>Listing</strong>, we point out only that either the
                  Member or the LIsting has undergone an identification or
                  verification procedure, nothing further.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  LIMITATIONS ON LIABILITY
                </h2>
                <p>
                  <strong>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR MANAGING
                    MEMBERS, SHAREHOLDERS, PERSONNEL, AFFILIATES, LICENSORS,
                    CONTRACTORS, CONSULTANTS, AGENTS, AND SUPPLIERS, SUCCESSORS
                    OR ASSIGNS (THE “FLYINN TEAM”) WILL NOT BE LIABLE FOR ANY
                    INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, CONSEQUENTIAL,
                    PUNITIVE, OR MULTIPLE DAMAGES, INCLUDING ANY LOST OF
                    PROFITS, REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY,
                    OR ANY LOSS OF DATA, LOSS OF USE, LOSS OF GOODWILL, DAMAGE
                    TO COMPUTERS/EQUIPMENT, INTERRUPTION OF SERVICE, SYSTEM
                    FAILURE, THE COST OF REPLACEMENT PRODUCTS OR SERVICES, ANY
                    DAMAGES FOR PERSONAL PROPERTY OR PHYSICAL INJURY, OR
                    EMOTIONAL DISTRESS OR OTHER INTANGIBLE LOSSES, RESULTING
                    FROM OR IN CONNECTION WITH: (A) THE PLATFORM, (B) THESE
                    TERMS, (C) ANY VIOLATION OF THESE TERMS BY YOU OR A THIRD
                    PARTY, (C) THE USE OR INABILITY TO USE THE PLATFORM AND/OR
                    ITS TOOLS OR SERVICES OR CONTENT, (D) THE CONDUCT OF OTHER
                    USERS OR THIRD PARTIES ON OR THROUGH THE PLATFORM, (E) ANY
                    COMMUNICATIONS, INTERACTIONS, OR MEETINGS YOU ENGAGE IN WITH
                    INDIVIDUALS YOU ENCOUNTER THROUGH, OR ARISING FROM YOUR USE
                    OF THE PLATFORM (E) THE CONTENT OTHER USERS OR THIRD PARTIES
                    CONTRIBUTE TO THE PLATFORM.
                  </strong>
                </p>
                <p>
                  <strong>
                    APART FROM OUR RESPONSIBILITY TO SEND DISBURSEMENTS TO HOSTS
                    UNDER THESE TERMS, OR MAKE PAYMENTS TO MEMBERS THAT HAVE
                    SUFFERED DAMAGES UNDER THESE TERMS, IN ALL EVENTS, OUR
                    LIABILITY, AND THE LIABILITY OF ANY MEMBER OF THE FLYINN
                    TEAM FOR ANY CLAIM OR DISPUTE ARISING OUT OF OR IN
                    CONNECTION WITH THE PLATFORM IS LIMITED TO THE TOTAL AMOUNT
                    OF FEES (A) HOSTS HAVE BEEN PAID DURING THE PREVIOUS 12
                    MONTHS PRECEDING THE INCIDENT THAT LEADS TO THE LIABILITY
                    (B) GUESTS HAVE PAID DURING THE PREVIOUS 12 MONTHS PRECEDING
                    THE INCIDENT THAT LEADS TO THE LIABILITY, OR (C) A MAXIMUM
                    OF ONE HUNDRED U.S. DOLLARS (US$100) TO ALL OTHERS.
                  </strong>
                </p>
                <p>
                  <strong>
                    THESE LIMITATIONS ON LIABILITY APPLY REGARDLESS OF WHETHER
                    THE DAMAGES ARE A RESULT OF (1) BREACH OF WARRANTY, BREACH
                    OF CONTRACT, NEGLIGENCE, STRICT TORT LIABILITY (INCLUDING
                    NEGLIGENCE) OR OTHER LEGAL OR EQUITABLE THEORY, TO THE
                    FULLEST EXTENT SUCH LIMITATIONS ON LIABILITY ARE NOT
                    PROHIBITED BY APPLICABLE LAW.
                  </strong>
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  INDEMNIFICATION AND RELEASE
                </h2>
                <p>
                  <strong>
                    IF YOU HAVE A DISAGREEMENT WITH ONE OR MORE OTHER USERS OF
                    THE PLATFORM OR ANY THIRD-PARTY PROVIDER OR WEBSITE, TO THE
                    FULLEST EXTENT PERMITTED BY APPLICABLE LAW, YOU AGREE TO
                    RELEASE, REMISE AND FOREVER DISCHARGE, INDEMNIFY, DEFEND (AT
                    FLYINN’S OPTION), AND HOLD EACH MEMBER OF THE FLYINN GROUP
                    (INCLUDING FLYINN DISBURSEMENTS), EACH OF THEIR RESPECTIVE
                    AGENTS, DIRECTORS, OFFICERS, OTHER AFFILIATES, PERSONNEL,
                    AND ALL OTHER RELATED PERSONS OR ENTITIES HARMLESS FROM AND
                    AGAINST ANY AND ALL MANNER OF RIGHTS, CLAIMS, COMPLAINTS,
                    LIABILITIES, DEMANDS, DAMAGES, CAUSES OF ACTION, LEGAL
                    CLAIMS, PROCEEDINGS, OBLIGATIONS, RECOVERIES, LOSSES,
                    EXPENSES, FINES, PENALTIES, LEGAL FEES, ACCOUNTING FEES,
                    COSTS, EXPENSES, AND PAYMENTS OF ANY KIND, KNOWN OR UNKNOWN,
                    ARISING FROM OR IN ANY WAY RELATED TO SUCH DISAGREEMENT;
                    YOUR USE OF THE PLATFORM; YOUR VIOLATION OF THESE TERMS
                    INCLUDING ALL OTHER POLICIES INCLUDED HEREIN BY REFERENCE;
                    YOUR BOOKING AND USE OF A RENTAL PROPERTY; YOUR ENGAGEMENT
                    WITH ANY MEMBER; YOUR CONSUMPTION OF ANY OFFERING, GOODS OR
                    SERVICES; ANY INJURIES, LOSSES OR DAMAGES OF ANY KIND,
                    WHETHER THEY BE CONSEQUENTIAL, INCIDENTAL, COMPENSATORY,
                    DIRECT, OR OTHERWISE, RELATING TO, ARISING FROM, IN
                    CONNECTION WITH OR AS A RESULT OF SUCH ENGAGEMENT, BOOKING,
                    PARTICIPATION, CONSUMPTION, OR USE; YOUR VIOLATION OF ANY
                    LAWS, REGULATIONS, RULES OR ORDINANCES; OR YOUR INFRINGEMENT
                    OR VIOLATION OF THIRD-PARTY RIGHTS SUCH AS INTELLECTUAL
                    PROPERTY OR PRIVACY RIGHTS.
                  </strong>
                </p>
                <p>
                  <strong>
                    YOU MUST COOPERATE AS FULLY AS REASONABLY NECESSARY IN THE
                    DEFENSE OF ANY CLAIM.
                  </strong>
                </p>
                <p>
                  <strong>
                    YOU ARE NOT PERMITTED TO SETTLE ANY MATTER WITHOUT OUR
                    WRITTEN CONSENT UNDER ANY CIRCUMSTANCES.
                  </strong>
                </p>
                <p>
                  <strong>
                    IF YOU ARE A RESIDENT OF THE STATE OF CALIFORNIA, YOU HEREBY
                    WAIVE CALIFORNIA CIVIL CODE SECTION 1542, WHICH READS: “A
                    GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR
                    DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME
                    OF EXECUTING THE RELEASE, WHICH, IF KNOWN BY HIM MUST HAVE
                    MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR.
                  </strong>
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CONTRACTING ENTITIES
                </h2>
                <p>FlyInn, LLC P.O. Box 270439 Fruitland, UT 84027</p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  USA DISPUTE RESOLUTION AND ARBITRATION AGREEMENT
                </h2>
                <p>
                  <strong>
                    PLEASE READ THIS SECTION CAREFULLY. IT STIPULATES THAT YOU
                    AND FLYINN CONSENT TO RESOLVE ALL DISPUTES BETWEEN US
                    THROUGH BINDING INDIVIDUAL ARBITRATION OR IN SMALL CLAIMS
                    COURT, AND INCLUDES A CLASS ACTION WAIVER AND JURY TRIAL
                    WAIVER AND IT PROHIBITS YOU FROM PURSUING A CLASS ACTION OR
                    SIMILAR PROCEEDING IN ANY VENUE.
                  </strong>
                </p>
                <p>
                  If your country of residence upholds{" "}
                  <strong>arbitration agreements</strong>, like, for example,
                  the United States,
                  <strong>Arbitration is mandatory</strong>. If you are located
                  outside the United States but seek to bring a claim within the
                  United States, <strong>arbitration is necessary</strong>
                  for determining the threshold issue of whether this dispute
                  resolution section pertains to you, along with all other
                  threshold determinations, including arbitrability, venue,
                  residency, and applicable law. If your country of residence
                  does not uphold arbitration agreements, the{" "}
                  <strong>
                    compulsory pre-arbitration dispute resolution process
                  </strong>
                  , notification requirements, and prohibition on{" "}
                  <strong>class actions or representative proceedings</strong>{" "}
                  outlined below still apply to the extent permitted by law.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  USA GOVERNING LAW AND VENUE
                </h2>
                <p>
                  If you reside or have your place of establishment in the
                  United States, the arbitrator shall apply the
                  <strong>law of the state of Utah</strong> and the United
                  States, without regard to conflict-of-law provisions, with the
                  exception that all provisions related to
                  <strong>arbitration</strong> are governed by the{" "}
                  <strong>FAA</strong>. Legal proceedings (excluding small
                  claims actions) that are exempt from the arbitration agreement
                  must be initiated in state or federal court in{" "}
                  <strong>Salt Lake City, Utah</strong> unless we both consent
                  to a different venue. Both you and we agree to venue and
                  personal jurisdiction in <strong>Salt Lake City, Utah</strong>
                  . Foreign laws are not applicable. Any changes to this{" "}
                  <strong>
                    Arbitration Agreement
                    <strong> can only be made with </strong>mutual agreement in
                    writing
                  </strong>
                  .
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  DISPUTE RESOLUTION PROCESS
                </h2>
                <p>
                  FlyInn is dedicated and committed to excellent service and
                  engaging in a <strong>dispute resolution process</strong> that
                  is focused on <strong>Member satisfaction</strong>.
                </p>
                <p>
                  Following is our two-part resolution process:{" "}
                  <strong>
                    Part 1<strong> – an investigation and </strong>informal
                    negotiation
                  </strong>{" "}
                  of your claim with FlyInn’s customer service team, and if
                  necessary <strong>Part 2</strong> – a{" "}
                  <strong>binding arbitration</strong>
                  pursuant to the terms of this{" "}
                  <strong>
                    Arbitration Agreement<strong>, (conducted by the </strong>
                    American Arbitration Association
                  </strong>
                  , or an agreed-upon arbitral tribunal for arbitrations
                  conducted outside of the United States).
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  HOW THE ARBITRATION AGREEMENT APPLIES TO YOU
                </h2>
                <p>
                  This <strong>Arbitration Agreement</strong> (defined below)
                  only applies to you if your country of residence or
                  establishment is the <strong>United States</strong>. If your
                  country of residence or establishment is <strong>not</strong>{" "}
                  the United States, and you nevertheless attempt to bring any
                  legal claim against FlyInn in the United States, this
                  Arbitration Agreement will apply for determination of the
                  threshold issue of whether this Arbitration Agreement Section
                  22 applies to you, and all other threshold determinations,
                  including residency, arbitrability, venue, and applicable law.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  MANDATORY PRE-ARBITRATION DISPUTE RESOLUTION AND NOTIFICATION
                </h2>
                <p>
                  You agree to give us the opportunity to resolve any
                  <strong>Dispute</strong>. by sending us an{" "}
                  <strong>
                    individualized notice
                    <strong> of the Dispute in writing (“</strong>Pre-Dispute
                    Notice<strong>”) at least </strong>60 days prior
                  </strong>{" "}
                  to initiating arbitration, and attempting in good faith to
                  <strong>negotiate an informal resolution</strong> of the
                  individual claim.
                </p>
                <p>
                  The <strong>Pre-Dispute Notice</strong> must include the
                  following: (A) the date, (B) your name, (C) your mailing
                  address, (D) your FlyInn username, (E) the email address you
                  used to make your reservation (and, if different, the email
                  address you used to register your FlyInn account,) (F) a brief
                  description of the nature of your complaint, (G) the relief
                  that you are seeking, and (H) your signature.
                </p>
                <p>
                  You must send your <strong>Pre-Dispute Notice</strong> to
                  FlyInn by
                  <strong>certified mail</strong>, to FlyInn’s agent for
                  service: FRONTIER REGISTERED AGENCY SERVICES LLC, 2120 Carey
                  Ave Cheyenne, WY 82001 We will send our Pre-Dispute Notice to
                  the email address(es) linked to your FlyInn account.
                </p>
                <p>
                  If the parties can’t resolve the complaint within the
                  <strong>60-day period</strong>, only then may either party
                  commence an <strong>arbitration proceeding</strong> by
                  submitting a written request for arbitration to the designated
                  arbitration provider mentioned in the Arbitration Rules and
                  Governing Law Section.
                </p>
                <p>
                  Participating in this{" "}
                  <strong>
                    pre-arbitration dispute resolution and notification
                    procedure is mandatory
                  </strong>
                  before initiating arbitration. The <strong>AAA</strong> cannot
                  oversee or resolve the Dispute unless and until all
                  “pre-arbitration dispute resolution and notification” criteria
                  have been satisfied. Therefore, you must attach a copy of the
                  Pre-Dispute Notice and proof that it was sent, to any
                  arbitration demand you file.
                </p>
                <p>
                  The <strong>statute of limitations will be tolled</strong>{" "}
                  while the parties are involved in the dispute resolution
                  process mandated by this Section.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  NOTICE
                </h2>
                <p>
                  <b>Notices TO US:</b> Unless expressly stated otherwise, any
                  notices and communications to FlyInn shall be in{" "}
                  <strong>writing</strong> and shall be deemed to have been duly
                  given or made (A) with delivery by hand, when delivered, (B)
                  with delivery by <strong>certified or registered mail</strong>
                  , postage prepaid; or (C) with delivery by{" "}
                  <strong>internationally recognized overnight courier</strong>.
                  Notices to FlyInn must be sent to FlyInn, LLC P.O. Box 270439
                  Fruitland, UT 84027.
                </p>
                <p>
                  <b>Notices TO YOU or any other Member:</b> Unless expressly
                  stated otherwise, any notices and communications to Members
                  allowed or mandated by this agreement, will be sent
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>
                    <strong>Electronically</strong> and given by FlyInn
                    <ol className="pl-5 list-[lower-alpha] space-y-1">
                      <li>
                        to the email address you furnish to the
                        <strong>Platform</strong> during your registration
                        process, or the email address you use when you book or
                        inquire about a rental property, or as you may have
                        subsequently revised in your account
                      </li>
                      <li>
                        as an <strong>SMS</strong> or <strong>WhatsApp</strong>{" "}
                        message
                      </li>
                      <li>
                        as a notification on the <strong>Platform</strong>,
                        visible in your inbox in your dashboard
                      </li>
                      <li>
                        any alternate method of communication you provide us
                        with and we make available.
                      </li>
                    </ol>
                  </li>
                  <li>
                    Via <strong>certified mail</strong>, postage prepaid and
                    return receipt requested, to any physical address you
                    furnish to the <strong>Platform</strong> during your
                    registration process, or as you may have subsequently
                    revised in your account.
                  </li>
                </ol>
                <p>
                  Regarding <strong>email</strong>, notice shall be considered
                  to have been duly given upon receipt or{" "}
                  <strong>24 hours</strong>
                  after an email is sent unless the sender is notified that the
                  recipient’s email address is invalid. Regarding{" "}
                  <strong>physical mail</strong>, notice shall be considered to
                  have been duly given <strong>three (3) days</strong>
                  after the date of mailing to a physical address.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  AGREEMENT TO ARBITRATE (“ARBITRATION AGREEMENT”)
                </h2>
                <p>
                  <strong>
                    YOU AND WE MUTUALLY AGREE THAT ANY DISPUTE, CLAIM, OR
                    CONTROVERSY ARISING OUT OF OR RELATING IN ANY WAY TO ANY USE
                    OF THE PLATFORM; ANY CONTENT; ANY SERVICES, FEATURES, OR
                    PRODUCTS PROVIDED BY US; ANY OFFERINGS, LISTINGS, GOODS OR
                    SERVICES; THESE TERMS, OUR PRIVACY POLICY, OR THE
                    APPLICABILITY, BREACH, TERMINATION, VALIDITY, ENFORCEMENT OR
                    INTERPRETATION THEREOF, OR (COLLECTIVELY, “{" "}
                    <strong>DISPUTES</strong>”)
                  </strong>
                  <br />
                  <strong>
                    WILL BE RESOLVED BY BINDING ARBITRATION ON AN INDIVIDUAL
                    BASIS RATHER THAN IN COURT EXCEPT THOSE RESOLVED IN SMALL
                    CLAIMS COURT. (THE “{" "}
                  </strong>
                  ARBITRATION AGREEMENT<strong>”).</strong>
                  <br />
                  <strong>
                    THIS ENCOMPASSES ANY CLAIMS YOU MAKE AGAINST US, OUR
                    SUBSIDIARIES, OR ANY COMPANIES PROVIDING PRODUCTS OR
                    SERVICES THROUGH US (THESE COMPANIES ARE BENEFICIARIES OF
                    THIS ARBITRATION AGREEMENT).THIS ARBITRATION AGREEMENT IS
                    BINDING AND COVERS ANY CLAIMS BROUGHT BY OR AGAINST THIRD
                    PARTIES, YOUR SPOUSES, HEIRS, THIRD-PARTY BENEFICIARIES, AND
                    ASSIGNS, IN CASES WHERE THEIR CLAIMS ARE RELATED TO YOUR
                    UTILIZATION OF OUR SERVICES. IF ANY THIRD-PARTY BENEFICIARY
                    TO THESE TERMS LODGES CLAIMS AGAINST THE ENTITIES COVERED BY
                    THESE TERMS, THOSE CLAIMS WILL ALSO BE SUBJECT TO THIS
                    ARBITRATION AGREEMENT.
                  </strong>
                  <br />
                  <strong>
                    YOU AND WE MUTUALLY AGREE THAT THE ARBITRATOR WILL BE
                    RESPONSIBLE FOR DETERMINING ALL THRESHOLD ARBITRABILITY
                    ISSUES, INCLUDING, BUT NOT LIMITED TO, ANY OBJECTIONS WITH
                    RESPECT TO THE EXISTENCE, SCOPE, OR VALIDITY OF THE
                    ARBITRATION AGREEMENT; ANY DEFENSE TO ARBITRATION SUCH AS
                    ISSUES RELATING TO WHETHER THIS ARBITRATION AGREEMENT CAN BE
                    ENFORCED, APPLIES TO A DISPUTE; AND ANY ISSUE RELATING TO
                    WHETHER THESE TERMS, OR ANY PROVISION OF THESE TERMS, IS
                    UNCONSCIONABLE OR ILLUSORY OR ANY DEFENSE TO ARBITRATION,
                    INCLUDING WAIVER, DELAY, LACHES, UNCONSCIONABILITY, OR
                    ESTOPPEL.
                  </strong>
                </p>
                <p>
                  TO CLARIFY, YOU AND FLYINN MUTUALLY CONSENT THAT ANY ISSUE
                  CONCERNING <strong>ARBITRABILITY</strong>, AND THE
                  ESTABLISHMENT, ENFORCEABILITY, VALIDITY, EXTENT, OR
                  INTERPRETATION OF ALL OR PART OF ANY SECTION IN THESE
                  <strong>TERMS</strong> CONCERNING <strong>ARBITRATION</strong>
                  , INCLUDING ANY DISAGREEMENT REGARDING COMPLIANCE WITH THE
                  <strong>PRE-DISPUTE NOTICE</strong> REQUIREMENT AND A PARTY’S
                  OBLIGATION TO COVER <strong>ARBITRATION COSTS</strong>, WILL
                  BE SETTLED SOLELY BY AN ARBITRATOR.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ARBITRATION RULES AND GOVERNING LAW
                </h2>
                <p>
                  This <strong>Arbitration Agreement</strong> is a “written
                  agreement to arbitrate” and evidences a transaction in
                  interstate commerce. The{" "}
                  <strong>Federal Arbitration Act</strong>
                  (“ <strong>FAA</strong>”) governs all substantive and
                  procedural interpretation and enforcement of this provision,
                  and not state law. The arbitration will be administered by the{" "}
                  <strong>American Arbitration Association</strong> (“
                  <strong>AAA</strong> ”) following the Selected Federal Rules
                  and the AAA’s Consumer Arbitration Rules and/or other AAA
                  arbitration rules determined to be applicable by the AAA (the
                  “<strong>AAA Rules</strong>”) then in effect, except as
                  modified here. The AAA Rules are available at{" "}
                  <CustomLink to="http://www.adr.org/">www.adr.org</CustomLink>{" "}
                  . If the <strong>AAA</strong> is unable or unwilling to
                  administer the arbitration, you and FlyInn will consult and
                  choose an alternative arbitration forum. If we fail to reach
                  an agreement, then either you or FlyInn may request a court to
                  appoint an arbitrator in accordance with 9 U.S.C. § 5. In such
                  a scenario, the arbitration will adhere to the rules of the
                  designated arbitration forum, unless those rules conflict with
                  the provisions of this <strong>Arbitration Agreement</strong>.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ARBITRATION CONTROVERSY AMOUNT DETERMINES LOCATION
                </h2>
                <p>
                  If the disputed amount is <strong>$1,000,000 or less</strong>,
                  any necessary arbitration hearing will be conducted remotely
                  via <strong>video conference</strong> unless otherwise
                  mutually agreed upon by the parties or directed by the
                  arbitrator.
                </p>
                <p>
                  If the disputed amount is{" "}
                  <strong>greater than $1,000,000</strong>, any necessary
                  arbitration hearing will be held in
                  <strong>Salt Lake County, Utah</strong>, unless otherwise
                  mutually agreed upon by the parties or directed by the
                  arbitrator.
                </p>
                <p>
                  If the disputed amount is{" "}
                  <strong>less than or equal to $10,000</strong>, the parties
                  consent to proceed solely through the{" "}
                  <strong>submission of documents</strong> to the arbitrator.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ARBITRATION FEES AND COSTS
                </h2>
                <p>
                  Payment of all filing, administration, and arbitrator fees
                  (collectively, the “<strong>Arbitration Fees</strong>”) will
                  be governed by the <strong>AAA Rules</strong>, and where
                  appropriate, limited by the{" "}
                  <strong>AAA Consumer Rules</strong>, unless otherwise provided
                  in this <strong>Arbitration Agreement</strong>. In order to
                  initiate arbitration, each party will be responsible for
                  paying the filing fees required by the <strong>AAA</strong>,
                  To request a <strong>fee waiver</strong>, you can submit an
                  affidavit under oath to the arbitration provider. This
                  affidavit should include your total monthly income from all
                  sources and the number of individuals in your household. The{" "}
                  <strong>AAA</strong>
                  primarily considers the federal poverty guidelines when
                  approving fee waivers. If your gross monthly income falls
                  below <strong>300% of the federal poverty guidelines</strong>,
                  you qualify for a waiver of arbitration fees and costs, except
                  for arbitrator fees. If you successfully demonstrate to the
                  arbitrator that you are financially unable to cover your share
                  of the
                  <strong>Arbitration Fees</strong>, or if the arbitrator
                  decides for any reason that you shouldn’t be obligated to pay
                  your portion of the Arbitration Fees, we will cover as much of
                  your filing and hearing fees for the arbitration in connection
                  with the arbitration as the arbitrator deems necessary to
                  ensure it remains financially feasible compared to litigation
                  costs. This assistance will be provided regardless of the
                  arbitration outcome unless the arbitrator finds that your
                  claim(s) was frivolous or made in bad faith.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  IMPROPER PURPOSE, BAD FAITH, FRIVOLOUS
                </h2>
                <p>
                  Either party may make a request that the arbitrator impose{" "}
                  <strong>sanctions</strong>, such as awarding attorneys’ fees
                  and costs upon proving that the other party (or the other
                  party’s counsel) has asserted a claim, cross-claim, or defense
                  that is groundless in fact or law, brought in{" "}
                  <strong>bad faith</strong> or for the purpose of harassment,
                  or is otherwise <strong>frivolous</strong>, as allowed by
                  applicable law and the <strong>AAA Rules</strong>.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ARBITRATOR’S DECISION
                </h2>
                <p>
                  The arbitrator will issue a <strong>written decision</strong>{" "}
                  which will include the essential findings and conclusions on
                  which the arbitrator bases the award. Judgment on the
                  arbitration award may be entered in any court with proper
                  jurisdiction. The arbitrator may award any relief allowed by
                  law or the <strong>AAA Rules</strong>, but
                  <strong>declaratory or injunctive relief</strong> may be
                  awarded only on an <strong>individual basis</strong> and only
                  to the extent necessary to provide relief warranted by the
                  claimant’s individual claim.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CLASS ACTIONS, REPRESENTATIVE PROCEEDINGS, JURY TRIALS
                </h2>
                <p>
                  You and we acknowledge and agree that, to the fullest extent
                  permitted by law, any and all proceedings to resolve Claims
                  will be conducted only on an
                  <strong>individual basis</strong> and not as a plaintiff or
                  class member in any purported{" "}
                  <strong>class action lawsuit</strong>,
                  <strong>class-wide arbitration</strong>,{" "}
                  <strong>
                    private attorney general action
                    <strong>, or any other manner of </strong>representative or
                    consolidated proceeding
                  </strong>
                  .
                  <br />
                  To the full extent permitted by law, (1) the arbitrator shall
                  not consolidate claims of different parties into one
                  proceeding
                  <br />
                  and (2) shall not preside over any type of{" "}
                  <strong>class or representative proceeding</strong> on behalf
                  of the general public or any other persons unless agreed upon
                  in writing or as stipulated in this agreement.
                </p>
                <p>
                  If there is a final judicial determination that applicable law
                  precludes enforcement of the <strong>waiver</strong>
                  contained in this paragraph as to any claim, cause of action,
                  or requested remedy, then you and we agree that that claim,
                  cause of action, or requested remedy, (and only that claim,
                  cause of action, or requested remedy,) to the extent necessary
                  must be <strong>severed from the arbitration</strong> and may
                  be litigated in a court of competent jurisdiction in the state
                  or federal courts located in the{" "}
                  <strong>State of Utah</strong>.
                </p>
                <p>
                  In the event that a claim, cause of action, or requested
                  remedy is severed pursuant to this paragraph, then you and we
                  agree that the claims, causes of action, or requested remedies
                  that are not subject to arbitration will be{" "}
                  <strong>stayed</strong> until all arbitrable claims, causes of
                  action and requested remedies are resolved by the arbitrator.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  JURY TRIAL WAIVER
                </h2>
                <p>
                  You and FlyInn acknowledge and agree that both parties are
                  each <strong>waiving the right to a jury trial</strong>
                  concerning all arbitrable <strong>Disputes</strong>.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  SMALL CLAIMS VS. ARBITRATION
                </h2>
                <p>
                  You and we each reserve the right to bring, or remove, any
                  claim in <strong>small claims court</strong> instead of
                  arbitration.
                  <br />
                  if the claim falls within the jurisdictional limit of such
                  court; provided that such court lacks the authority to
                  consider any claims on a{" "}
                  <strong>class or representative basis</strong>, or to
                  consolidate or join the claims of other individuals or parties
                  who may be similarly situated in such legal proceedings. If
                  the claims asserted in any demand for arbitration do fall
                  within the jurisdictional limit of such court, then either you
                  or we may opt to have the claims adjudicated in{" "}
                  <strong>small claims court</strong> instead of through
                  arbitration, at any point before the arbitrator is appointed,
                  or in accordance with the
                  <strong>AAA rules</strong>, by informing the other party of
                  that decision in writing.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  OFFER OF JUDGMENT
                </h2>
                <p>
                  Unless prohibited by applicable law, in any legal proceeding
                  between you and FlyInn (whether in court or arbitration), at
                  least <strong>fourteen (14) calendar days</strong>
                  before the arbitration hearing’s date, either party (you or
                  FlyInn) may serve an <strong>offer of judgment</strong> in
                  writing upon the other party to allow judgment on specified
                  terms. If the offer is accepted, the offer with proof of
                  acceptance will be submitted to the arbitration provider, who
                  shall enter judgment accordingly. If the offer is not accepted
                  before the arbitration hearing or within 30 days after it is
                  made, whichever occurs first, the offer shall be deemed
                  withdrawn and cannot be submitted as evidence in the
                  arbitration, except concerning costs (including all fees paid
                  to the arbitration provider). If an offer made by one party is
                  not accepted by the other party, and the other party fails to
                  obtain a more favorable judgment or award, the other party
                  shall not recover their post-offer costs and shall pay the
                  offering party’s costs (including all fees paid to the
                  arbitration provider/arbitral forum) incurred from the time of
                  the offer.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  SEVERABILITY AND SURVIVAL
                </h2>
                <p>
                  If any portion of this{" "}
                  <strong>Dispute Resolution and Arbitration Agreement</strong>{" "}
                  is deemed illegal or unenforceable for any reason, (1) such
                  provision will be <strong>severed</strong> and the remainder
                  of the <strong>Arbitration Agreement</strong> will be given
                  full force and effect, (2) if any Claims must proceed on a{" "}
                  <strong>class</strong>,<strong>collective</strong>,{" "}
                  <strong>consolidated</strong>, or{" "}
                  <strong>
                    representative basis
                    <strong>, such Claims must be adjudicated in a </strong>
                    civil court of competent jurisdiction
                  </strong>{" "}
                  rather than in arbitration, and the parties consent to
                  litigation of those claims being <strong>stayed</strong>{" "}
                  pending the outcome of any individual Claims in arbitration.
                </p>
                <p>
                  This{" "}
                  <strong>Dispute Resolution and Arbitration Agreement</strong>
                  will <strong>survive</strong> any termination of these{" "}
                  <strong>Terms</strong>
                  and will continue to apply even if you stop using the
                  <strong>Platform</strong> or terminate your FlyInn account.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  INTERPRETING THE TERMS
                </h2>
                <p>
                  Unless supplemented by additional terms, policies, conditions,
                  standards, guidelines, etc., these
                  <strong>Terms</strong>, including those items herein
                  incorporated by reference, constitute the{" "}
                  <strong>entire agreement</strong>
                  between FlyInn and you pertaining to your access to or use of
                  the <strong>Platform</strong> and any other matters set forth
                  herein and supersede any and all prior oral or written
                  agreement between us and you.
                </p>
                <p>
                  If any provision of these <strong>Terms</strong> is held to be
                  <strong>invalid or unenforceable</strong> by any court of
                  competent jurisdiction, except as otherwise indicated in the
                  Jury Trial Waiver Section, the{" "}
                  <strong>other provisions</strong> of these Terms shall{" "}
                  <strong>remain in full force and effect</strong>.
                </p>
                <p>
                  If there is any conflict between these <strong>Terms</strong>{" "}
                  and any other terms and conditions pertinent to a product,
                  tool, or service provided on our <strong>Platform</strong>,
                  the terms stated herein shall take <strong>precedence</strong>
                  .
                </p>
                <p>
                  Further, any provision of these <strong>Terms</strong> held
                  invalid or unenforceable only in part or degree will{" "}
                  <strong>remain in full force and effect</strong> to the extent
                  not held invalid or unenforceable.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  ASSIGNMENT
                </h2>
                <p>
                  We reserve the right, without limitation and at our sole
                  discretion, to <strong>assign</strong>,{" "}
                  <strong>transfer</strong>, or
                  <strong>delegate</strong> these <strong>Terms</strong> and any
                  associated rights and responsibilities, with{" "}
                  <strong>30 days’ prior notice</strong>.
                </p>
                <p>
                  You may <strong>not</strong> assign, transfer, or delegate
                  these
                  <strong>Terms</strong> or your rights and obligations
                  hereunder without our <strong>prior written consent</strong>,
                  which we may grant or withhold, solely at our discretion.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  SURVIVAL
                </h2>
                <p>
                  All provisions that by their nature and intent remain valid
                  after the term of this Agreement will{" "}
                  <strong>survive termination</strong>.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  NO WAIVER
                </h2>
                <p>
                  FlyInn’s failure to enforce any right or provision in these{" "}
                  <strong>Terms</strong> shall <strong>not</strong> in any way
                  be construed as a <strong>waiver</strong> of such right or
                  provision nor prevent us from thereafter enforcing any right
                  or provision of this Agreement unless we acknowledge and agree
                  to it
                  <strong>in writing</strong>. Aside from what is explicitly
                  outlined in these <strong>Terms</strong>, the implementation
                  of any remedies by either party under these{" "}
                  <strong>Terms</strong> will not affect its other remedies
                  under these Terms or as otherwise allowed by law.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  FORCE MAJEURE
                </h2>
                <p>
                  FlyInn shall <strong>not be liable</strong> for any failure or
                  delay in performance under this Agreement to the extent such
                  failure or delay is caused by{" "}
                  <strong>abnormal or unforeseeable circumstances</strong>{" "}
                  beyond its reasonable control, the consequences of which would
                  have been unavoidable despite all efforts to the contrary,
                  including, but not limited to, acts of God, natural disasters,
                  war, terrorism, riots, civil unrest, government action,
                  embargoes, acts of civil or military authorities, fire,
                  floods, accidents, pandemics, epidemics or disease, strikes or
                  labor disputes, or shortages of transportation facilities,
                  fuel, energy, labor or materials.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  EMAILS AND SMS
                </h2>
                <p>
                  FlyInn makes use of the <strong>email account</strong> we have
                  on file for you, which you have provided, to send you
                  <strong>administrative notifications</strong>. We may also
                  send you
                  <strong>promotional emails</strong>. Third-party data rates
                  could apply to promotional emails.
                </p>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
                  CONTACT US
                </h2>
                <p>
                  If you have any questions about these <strong>Terms</strong>{" "}
                  please contact us on our contact page, call us, or email us
                  at&nbsp;
                  <CustomLink to="mailto:help@fly-inn.com">
                    help@fly-inn.com
                  </CustomLink>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermService;
