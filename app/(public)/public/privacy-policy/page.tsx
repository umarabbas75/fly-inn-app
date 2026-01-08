"use client";

import React from "react";
import Link from "next/link";

const Privacy = () => {
  const PRIMARY_COLOR = "text-[#af2322]";

  // Helper function for email links
  const EmailLink = ({
    email,
    children,
  }: {
    email: string;
    children: React.ReactNode;
  }) => (
    <a href={`mailto:${email}`} className={`hover:underline ${PRIMARY_COLOR}`}>
          {children}
        </a>
      );

  // Custom utility function for section headings
  const PolicyHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-8 pb-3 border-b border-gray-200">
      {children}
    </h2>
  );

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
          <div className=" mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-[#AF2322]/10 text-[#AF2322] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
              Legal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
            <p className="text-gray-600">Effective as of February 14, 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="app-container">
          <div className=" mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
                <p>
                  This <strong>Privacy Policy</strong> ("Policy") applies to
                  www.fly-inn.com, and FlyInn, LLC ("<strong>FlyInn</strong>")
                  and governs data collection and usage. For the purposes of
                  this Privacy Policy, unless otherwise noted, all references to
                  FlyInn include www.fly-inn.com, FlyInn Disbursements, LLC and
                  disbursements.fly-inn.com. FlyInn's platform is a{" "}
                  <strong>Hospitality site</strong>. By using FlyInn's platform,
                  you consent to the data practices described in this statement.
                      </p>

                      <PolicyHeading>
                          Collection of Your Personal Information
                      </PolicyHeading>
                      <p>
                  In order to better provide you with products and services
                  offered, <strong>FlyInn</strong> may collect{" "}
                  <strong>personally identifiable information</strong>, such as
                  your:
                      </p>
                      <ul className="list-disc pl-8 space-y-1">
                        <li>First and last name</li>
                        <li>Mailing address</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Date of birth</li>
                        <li>Profile Photo</li>
                      </ul>

                <p>
                  If you purchase{" "}
                  <strong>FlyInn's products and services</strong>, we collect{" "}
                  <strong>billing and credit card information</strong>. This
                  information is used to complete the purchase transaction.
                </p>

                <p>
                  <strong>FlyInn</strong> may also collect{" "}
                  <strong>anonymous demographic information</strong>, which is
                  not unique to you, such as your:
                </p>
                        <ul className="list-disc pl-8 space-y-1">
                          <li>Age</li>
                          <li>Gender</li>
                        </ul>

                <p>
                  Please keep in mind that if you directly disclose{" "}
                  <strong>personally identifiable information</strong> or{" "}
                  <strong>personally sensitive data</strong> through{" "}
                  <strong>FlyInn's</strong> public message boards, this
                          information may be collected and used by others.
                </p>

                <p>
                  We <strong>do not collect</strong> any personal information
                  about you unless you <strong>voluntarily provide</strong> it
                  to us. However, you may be required to provide certain
                  personal information to us when you elect to use certain
                  products or services. These may include:{" "}
                  <strong>
                    (a) registering for an account; (b) entering a sweepstakes
                    or contest
                  </strong>{" "}
                  sponsored by us or one of our partners;{" "}
                  <strong>(c) signing up for special offers</strong> from
                  selected third parties;{" "}
                  <strong>(d) sending us an email message</strong>;{" "}
                  <strong>
                    (e) submitting your credit card or other payment information
                  </strong>{" "}
                  when ordering and purchasing products and services. To wit, we
                  will use your information for, but not limited to,{" "}
                  <strong>communicating with you</strong> in relation to
                  services and/or products you have requested from us. We also
                  may gather additional personal or non-personal information in
                  the future.
                </p>

                <PolicyHeading>Use of Your Personal Information</PolicyHeading>
                <p>
                  FlyInn collects and uses your personal information in the
                  following ways:
                      </p>
                      <ul className="list-disc pl-8 space-y-1">
                        <li>
                    to <strong>operate and deliver</strong> the services you
                    have requested
                        </li>
                        <li>
                    to provide you with information, products, or services that
                    you <strong>request</strong> from us
                        </li>
                        <li>
                    to provide you with{" "}
                    <strong>notices about your account</strong>
                        </li>
                        <li>
                    to carry out <strong>FlyInn obligations</strong> and enforce
                    our rights arising from any <strong>contracts</strong>{" "}
                    entered between you and us, including for{" "}
                    <strong>billing and collection</strong>
                        </li>
                        <li>
                    to <strong>notify you about changes</strong> to our
                    www.fly-inn.com or any products or services we offer or
                    provide through it
                        </li>
                        <li>
                          in any other way we may describe when you provide the
                          information
                        </li>
                  <li>
                    for any other purpose with your <strong>consent</strong>
                  </li>
                      </ul>
                      <p>
                  <strong>FlyInn</strong> may also use your{" "}
                  <strong>personally identifiable information</strong> to inform
                  you of other products or services available from{" "}
                  <strong>FlyInn</strong> and its <strong>affiliates</strong>.
                      </p>

                      <PolicyHeading>
                          Sharing Your Information with Third Parties
                      </PolicyHeading>
                <p>
                  <strong>FlyInn</strong> does <strong>NOT</strong> sell, rent,
                  or lease its customer lists to third parties.
                </p>
                <p>
                  <strong>FlyInn</strong> may, from time to time,{" "}
                  <strong>
                    contact you on behalf of external business partners
                  </strong>{" "}
                  about a particular offering that may be of interest to you. In
                  those cases, your{" "}
                  <strong>unique personally identifiable information</strong>{" "}
                  (email, name, address, phone number) is{" "}
                  <strong>not transferred</strong> to the third party.{" "}
                  <strong>FlyInn</strong> may share data with{" "}
                  <strong>trusted partners</strong> to help perform statistical
                  analysis, send you email or postal mail, provide customer
                  support, or arrange for deliveries. All such third parties are{" "}
                  <strong>
                    prohibited from using your personal information
                  </strong>{" "}
                  except to provide these services to <strong>FlyInn</strong>,
                  and they are{" "}
                  <strong>required to maintain the confidentiality</strong> of
                  your information.
                </p>
                <p>
                  <strong>FlyInn</strong> may{" "}
                  <strong>disclose your personal information</strong>, without
                  notice, if <strong>required to do so by law</strong> or in the
                  good faith belief that such action is necessary to:{" "}
                  <strong>
                    (a) conform to the edicts of the law or comply with legal
                    process served
                  </strong>{" "}
                  on <strong>FlyInn</strong> or the platform;{" "}
                  <strong>(b) protect and defend the rights or property</strong>{" "}
                  of <strong>FlyInn</strong>; and/or{" "}
                  <strong>
                    (c) act under exigent circumstances to protect the personal
                    safety
                  </strong>{" "}
                  of users of <strong>FlyInn</strong>, or the public.
                </p>

                <PolicyHeading>Tracking User Behavior</PolicyHeading>
                <p>
                  <strong>FlyInn</strong> may <strong>keep track of the</strong>{" "}
                  pages our users visit within <strong>FlyInn</strong>, in order
                  to <strong>determine what</strong> <strong>FlyInn</strong>{" "}
                  services are the <strong>most popular</strong>. This data is
                  used to deliver{" "}
                  <strong>customized content and advertising</strong> within{" "}
                  <strong>FlyInn</strong> to customers whose behavior indicates
                  that they are interested in a particular subject area.
                      </p>

                      <PolicyHeading>
                          Automatically Collected Information
                      </PolicyHeading>
                      <p>
                  <strong>FlyInn</strong> may{" "}
                  <strong>automatically collect information</strong> about your{" "}
                  <strong>computer hardware and software</strong>. This
                  information can include your <strong>IP address</strong>,{" "}
                  <strong>browser type</strong>, <strong>domain names</strong>,{" "}
                  <strong>access times</strong>, and{" "}
                  <strong>referring website addresses</strong>. This information
                  is used for the <strong>operation of the service</strong>, to{" "}
                  <strong>maintain quality of the service</strong>, and to
                  provide <strong>general statistics</strong> regarding the use
                  of <strong>FlyInn's</strong> platform.
                </p>

                <PolicyHeading>Links</PolicyHeading>
                <p>
                  This platform contains <strong>links to other sites</strong>.
                  Please be aware that we are <strong>not responsible</strong>{" "}
                  for the{" "}
                  <strong>
                    content or privacy practices of such other sites
                  </strong>
                  . We encourage our users to be aware when they leave our
                  platform and to read the privacy statements of any other site
                  that collects personally identifiable information.
                      </p>

                      <PolicyHeading>
                        Security of your Personal Information
                      </PolicyHeading>
                      <p>
                  <strong>FlyInn</strong>{" "}
                  <strong>secures your personal information</strong> from{" "}
                  <strong>unauthorized access, use, or disclosure</strong>.{" "}
                  <strong>FlyInn</strong> uses the following methods for this
                        purpose:
                      </p>
                      <ul className="list-disc pl-8 space-y-1">
                  <li>
                    <strong>SSL Protocol</strong>
                  </li>
                      </ul>
                      <p>
                  When personal information (such as a credit card number) is
                  transmitted to other websites, it is{" "}
                  <strong>protected through the use of encryption</strong>, such
                  as the <strong>Secure Sockets Layer (SSL) protocol</strong>.
                      </p>
                      <p>
                  We strive to take{" "}
                  <strong>appropriate security measures</strong> to protect
                  against{" "}
                  <strong>
                    unauthorized access to or alteration of your personal
                    information
                  </strong>
                  . Unfortunately,{" "}
                  <strong>no data transmission over the Internet</strong> or any
                  wireless network can be{" "}
                  <strong>guaranteed to be 100% secure</strong>. As a result,
                  while we strive to protect your personal information, you
                  acknowledge that:{" "}
                  <strong>
                    (a) there are security and privacy limitations inherent to
                    the Internet that are beyond our control
                  </strong>
                  ; and{" "}
                  <strong>
                    (b) the security, integrity, and privacy of any and all
                    information and data exchanged between you and us through
                    this site cannot be guaranteed
                  </strong>
                  .
                      </p>

                      <PolicyHeading>Right to Deletion</PolicyHeading>
                      <p>
                  Subject to certain exceptions set out below, on receipt of a{" "}
                  <strong>verifiable request</strong> from you, we will:
                      </p>
                      <ul className="list-disc pl-8 space-y-1">
                        <li>
                    <strong>Delete your personal information</strong> from our
                    records; and
                        </li>
                        <li>
                    <strong>Direct any service providers to delete</strong> your
                          personal information from their records.
                        </li>
                      </ul>
                      <p>
                  Please note that we may <strong>not be able to comply</strong>{" "}
                  with requests to delete your personal information if it is
                  necessary to:
                      </p>
                      <ul className="list-disc pl-8 space-y-1">
                        <li>
                    <strong>Complete the transaction</strong> for which the
                    personal information was collected, fulfill the terms of a
                    written warranty or product recall conducted in accordance
                    with federal law, and provide a good or service requested by
                    you, or reasonably anticipated within the context of our
                    ongoing business relationship with you, or otherwise{" "}
                    <strong>perform a contract</strong> between you and us
                        </li>
                        <li>
                    <strong>Detect security incidents</strong>, protect against
                    malicious, deceptive, fraudulent, or illegal activity; or{" "}
                    <strong>prosecute those responsible</strong> for that
                    activity
                        </li>
                        <li>
                    <strong>Debug</strong> to identify and repair errors that
                    impair existing intended functionality
                        </li>
                        <li>
                    <strong>Exercise free speech</strong>, ensure the right of
                    another consumer to exercise his or her right of free
                    speech, or exercise another right provided for by law
                        </li>
                        <li>
                    <strong>
                      Comply with the California Electronic Communications
                      Privacy Act
                    </strong>
                        </li>
                        <li>
                    Engage in{" "}
                    <strong>
                      public or peer-reviewed scientific, historical, or
                      statistical research
                    </strong>{" "}
                    in the public interest that adheres to all other applicable
                    ethics and privacy laws, when our deletion of the
                    information is likely to render impossible or seriously
                    impair the achievement of such research, provided we have
                          obtained your informed consent
                        </li>
                        <li>
                    Enable solely <strong>internal uses</strong> that are
                    reasonably aligned with your expectations based on your
                          relationship with us
                        </li>
                        <li>
                    <strong>Comply with an existing legal obligation</strong>;
                    or
                        </li>
                        <li>
                    Otherwise use your personal information, internally, in a{" "}
                    <strong>lawful manner</strong> that is compatible with the
                          context in which you provided the information.
                        </li>
                      </ul>

                <PolicyHeading>Children Under Thirteen</PolicyHeading>
                <p>
                  <strong>FlyInn</strong>{" "}
                  <strong>
                    does not knowingly collect personally identifiable
                    information from children under the age of 13
                  </strong>
                  . If you are under the age of 13, you must ask your parent or
                  guardian for permission to use this platform.
                </p>

                <PolicyHeading>Email Communications</PolicyHeading>
                <p>
                  From time to time, <strong>FlyInn</strong> may{" "}
                  <strong>contact you via email</strong> for the purpose of
                  providing{" "}
                  <strong>
                    training, newsletters, announcements, promotional offers,
                    alerts, confirmations, surveys
                  </strong>
                  , and/or other general communication.
                </p>

                <PolicyHeading>External Data Storage Sites</PolicyHeading>
                <p>
                  We may <strong>store your data on servers</strong> provided by{" "}
                  <strong>third-party hosting vendors</strong> with whom we have
                        contracted.
                      </p>

                <PolicyHeading>Changes to This Statement</PolicyHeading>
                <p>
                  <strong>FlyInn</strong> reserves the{" "}
                  <strong>right to change this Policy</strong> from time to
                  time. For example, when there are changes in our services,
                  changes in our data protection practices, or changes in the
                  law. When{" "}
                  <strong>
                    changes to this Policy are significant, we will inform you
                  </strong>
                  . You may receive a notice by{" "}
                  <strong>sending an email</strong> to the primary email address
                  specified in your account, by placing a{" "}
                  <strong>prominent notice</strong> on our FlyInn, LLC, and/or
                  by updating any privacy information. Your continued use of the
                  platform and/or services available after such modifications
                  will constitute your:{" "}
                  <strong>(a) acknowledgment of the modified Policy</strong>;
                  and{" "}
                  <strong>
                    (b) agreement to abide and be bound by that Policy
                  </strong>
                  .
                </p>

                <PolicyHeading>Contact Information</PolicyHeading>
                <p>
                  <strong>FlyInn</strong> welcomes your questions or comments
                  regarding this Policy. If you believe that{" "}
                  <strong>FlyInn</strong> has not adhered to this Policy, please
                  contact <strong>FlyInn</strong> at:
                </p>
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-2">
                          FlyInn, LLC
                  </p>
                  <p className="text-gray-600">
                          P.O. Box 270439
                          <br />
                          Fruitland, Utah 84027
                        </p>
                  <p className="mt-4">
                    <span className="text-gray-600">Email: </span>
                    <EmailLink email="PIC@fly-inn.com">
                            PIC@fly-inn.com
                    </EmailLink>
                  </p>
                  <p className="mt-2">
                    <span className="text-gray-600">Phone: </span>
                    <span className="font-medium">321-435-9466</span>
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

export default Privacy;
