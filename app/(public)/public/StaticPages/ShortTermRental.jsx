import React from "react";
import Link from "next/link";

const ShortTermRental = () => {
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
                <li className="text-gray-700">Short-Term Rental Insurance</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800">
              Short-Term Rental Insurance
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  As part of our Terms of Service, Hosts must carry short-term
                  rental insurance (also known as home-sharing insurance).
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  The service is offered by many companies. Below is a
                  comprehensive list of all companies in the United States
                  (known to us as of the date of our Terms of Service) that
                  offer this type of insurance.
                </p>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  This is a comprehensive list, in alphabetical order. We do not
                  endorse nor are we affiliated with any of the companies listed
                  below in any way.
                </p>

                {/* Insurance Companies List */}
                <ul className="space-y-3 text-gray-700 mb-8">
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.allstate.com/home-insurance/host-advantage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Allstate
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.amfam.com/insurance/home/coverages/short-term-rental"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      American Family
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://amig.com/insurance/rental-property/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      American Modern
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.anderson.insure/short-term-rentals/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Anderson
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www2.cbiz.com/quote-landing-page2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Cbiz
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.erieinsurance.com/blog/short-term-rental-insurance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Erie
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.farmers.com/home/seasonal-vacation-homes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Farmers
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://fudgeinsurance.com/short-term-rental-insurance/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Fudge
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <div>
                      <a
                        href="https://www.teamibi.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#AF2322] hover:underline"
                      >
                        IBI
                      </a>
                      <span className="text-gray-700 ml-2">
                        - This provider teamed up with Chubb Insurance to offer
                        coverage specifically designed for properties that
                        welcome guests flying their own planes. This package
                        combines homeowner's and short-term rental insurance,
                        and in some cases, may lower your overall premium.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.insuraguest.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Insuraguest
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://nreig.com/tag/short-term-rental/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      NREIG
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.proper.insure/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Proper
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.usaa.com/inet/wc/insurance-home-rental-home?akredirect=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      USAA
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#AF2322] mr-2">•</span>
                    <a
                      href="https://www.steadily.com/get-a-quote/short-term-rental-insurance?utm_source=bing&utm_medium=paid_cpc&utm_content=kwd-85007244921309:loc-190&utm_term=short%20term%20rental%20insurance&adgroupid=1360097542830891&campaignid=424381626&utm_campaign=short-term-rental-insurance&msclkid=7f02cbc7579c1068c2c7ae10c2191b09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AF2322] hover:underline"
                    >
                      Steadily
                    </a>
                  </li>
                </ul>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Let us know if you become aware of any other companies
                  offering this service. You may use our contact form on our
                  Contact Page or send us an email to{" "}
                  <a
                    href="mailto:PIC@fly-inn.com"
                    className="text-[#AF2322] hover:underline"
                  >
                    PIC@fly-inn.com
                  </a>{" "}
                  and write "Suggestions" in the subject line.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Please consult with your lawyer and accountant to see which
                  options suit your situation best. FlyInn assumes no
                  responsibility for property damage, bodily injury, or any
                  other loss of any sort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShortTermRental;
