"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "../../_components/newsletter-section";

const PhilanthropyPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#AF2322]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container px-4 mx-auto md:px-12 py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="pl-0 md:pl-0">
              <div className="ml-5">
                <h1
                  style={{
                    fontSize: "40px",
                    lineHeight: "60px",
                    fontWeight: "700",
                    textAlign: "start",
                  }}
                >
                  WHAT IF IT WERE POSSIBLE...
                </h1>
                <h6
                  style={{
                    fontSize: "24px",
                    marginTop: "8px",
                    lineHeight: "36px",
                    fontWeight: "300",
                    textAlign: "start",
                  }}
                >
                  To eradicate poverty in eight weeks, To create communities of
                  giants, To educate the poor to such a degree that they cease
                  to be poor, Forget how to be poor, And pay it forward…
                </h6>
                <Link href="/public/contact-us">
                  <button
                    className="fontquick cursor-pointer font-quicksand py-4 px-9 rounded-md flex text-base leading-4 mt-5 border-none font-normal text-white hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: "#AF2322",
                    }}
                  >
                    Transform A Human Being's Life...
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How P.E.T.E. came to be Section */}
      <section className="relative py-20 md:py-28 bg-white">
        <div className="app-container px-4 mx-auto md:px-12">
          <h2
            className="fontquick"
            style={{
              fontSize: "28px",
              lineHeight: "40px",
              marginBottom: "30px",
              paddingLeft: "10px",
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            How P.E.T.E. came to be.
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="team-photo mb-4">
                <Image
                  src="/images/philanthropy/card1.jpg"
                  alt="Who We Are"
                  width={400}
                  height={300}
                  className="respimg w-full h-auto rounded-lg"
                />
              </div>
              <div className="team-info fl-wrap">
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "700",
                    fontFamily: "Quicksand",
                  }}
                >
                  Who We Are
                </h3>
                <p
                  style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  AOH is a group of companies focused on eradicating poverty in
                  the most impoverished areas of the world.
                  <br />
                  We work hand in hand with the people of each community we
                  serve to bring them the education and skills they need to
                  eradicate poverty in their village within eight weeks through
                  the use of technology.
                </p>
              </div>
            </div>
            <div>
              <div className="team-photo mb-4">
                <Image
                  src="/images/philanthropy/card2.jpg"
                  alt="Our Philosophy"
                  width={400}
                  height={300}
                  className="respimg w-full h-auto rounded-lg"
                />
              </div>
              <div className="team-info fl-wrap">
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "700",
                  }}
                >
                  Our Philosophy
                </h3>
                <p
                  style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  "Give a man a fish and you feed him for a day. Teach him how
                  to fish and you feed him for a lifetime." The old proverb is
                  accredited to Lao Tzu and true to his philosophy, we teach
                  people to fish. We work hand in hand with the people in the
                  villages of the most impoverished areas in the world to
                  eradicate poverty village by village in eight weeks. Our
                  sustainable and scalable program focuses on empowering each
                  community to create technology-based services that we help
                  market.
                </p>
              </div>
            </div>
            <div>
              <div className="team-photo mb-4">
                <Image
                  src="/images/philanthropy/card3.jpg"
                  alt="Our History"
                  width={400}
                  height={300}
                  className="respimg w-full h-auto rounded-lg"
                />
              </div>
              <div className="team-info fl-wrap">
                <h3
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "700",
                  }}
                >
                  Our History
                </h3>
                <p
                  style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  Poverty Eradication Through Education, P.E.T.E., started in
                  2010 with the burning desire to reach out to those in need and
                  give them the tools necessary to succeed, on their own.
                </p>
                <p
                  style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  We started three companies to help us reach our goals–an
                  education company, a short-term rental company, and a food
                  company. With God's help and guidance, we knew our mission
                  would succeed.
                </p>
                <p
                  style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  In 2022 we fired ourselves as heads of AOH and welcomed God as
                  our new CEO. Indeed, we drafted a welcome letter thanking Him
                  for taking over and submitting to His will and wisdom. A
                  separate document sets forth our mission to eradicate poverty
                  and make the Gospel of Jesus Christ available to all who want
                  to hear the good news.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution: P.E.T.E. Section */}
      <section className="relative py-20 md:py-28 bg-gray-50">
        <div className="app-container px-4 mx-auto md:px-12">
          <h2
            className="fontquick text-center"
            style={{
              fontSize: "30px",
              lineHeight: "60px",
              marginBottom: "30px",
              fontWeight: "700",
            }}
          >
            Solution: P.E.T.E.
          </h2>

          <div className="w-full">
            <div className="flex flex-wrap justify-center mb-10">
              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card1.jpg"
                  alt="Why P.E.T.E?"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h1
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Why P.E.T.E?
                  </h1>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    Because we love humanity. Because we lose 25,000 fellow
                    human beings to hunger every single day. That's 1,000,000
                    people every 40 days. That's 9,125,000 people per year. Why
                    cross our arms when we can do something about it?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    What is our solution?
                  </h6>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    A Simple, two-step process –
                  </p>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    1. Take one willing village at a time and completely
                    transform their lives in eight weeks by giving them the
                    education, skills, and tools they need to succeed. Instill
                    in them the desire to pay it forward.
                  </p>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    2. Enroll the community members in the possibility of being
                    contributing volunteers to teach members of other villages,
                    paying it forward.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card2.jpg"
                  alt="Our Solution"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card3.jpg"
                  alt="Solution Specifics"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg mb-4"
                />
              </div>
              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Solution Specifics
                  </h6>
                  <p>
                    1: We present our program to the entire village and show
                    them, through the experience of others who have gone before
                    them, how easily poverty is eradicated village by village,
                    community by community{" "}
                  </p>
                  <p>
                    2: When they accept, they embark on their journey with our
                    guidance and assistance. We work with the people hand in
                    hand to create the following:
                  </p>

                  <p style={{ marginLeft: "20px" }}>
                    a. Healthcare – we bring several doctors to begin caring for
                    the ill
                  </p>
                  <p style={{ marginLeft: "20px" }}>
                    b. Housing – we bring several contractors to begin
                    construction of safe homes, schools, clinics, and any other
                    necessary buildings. This includes solar energy since these
                    remote villages do not have access to power. It also
                    includes water wells. It also includes satellite internet
                    access. It also includes security systems so the products we
                    initially (and subsequently) bring in are not stolen. This
                    is all built by the people with our physical and financial
                    assistance and training{" "}
                  </p>
                  <p style={{ marginLeft: "20px" }}>
                    c. Education – we bring several teachers, depending on the
                    size of the village, to begin training the people in the
                    necessary skills to raise them out of poverty in eight weeks
                  </p>
                  <p style={{ marginLeft: "20px" }}>
                    d. Work –
                    <br />
                    <p style={{ marginLeft: "20px" }}>
                      {" "}
                      i: We begin a partnership with them in which we teach them
                      how to use simple cameras. We will teach them how to
                      record and edit videos that they will send to us to
                      broadcast and market. 100% of the profit their videos
                      produce goes to their income and the betterment of their
                      village
                      <br />
                      ii. We begin a partnership with them in which they learn
                      how to trade stocks online. 100% of the profits are
                      reinvested into their village
                      <br />
                      iii. We begin any other partnerships that are conducive to
                      the betterment of their situation.
                    </p>
                  </p>
                  <p>
                    They will eventually be weaned off our assistance and be
                    able to stand on their own, proud, and free from the bondage
                    of poverty. The income we help them make provides OPTIONS
                    for them so they may then be able to follow their own worthy
                    pursuits and dreams and not have to do the work we provided
                    for them at first. We will extend microloans so they can
                    begin businesses of their own. Again, 100% of the profit
                    produced from these loans will be reinvested in their
                    village
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Our Model
                  </h6>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    Our model is to train entire villages, one at a time. We
                    train the people, educate them, teach them English (the
                    language of business and technology), teach them technology,
                    and teach them skills that are immediately marketable–skills
                    that immediately produce an income even while they are still
                    being trained and learning. We also teach them the mindset
                    and philosophy that it takes to succeed financially–the very
                    mindset and philosophy that helped us succeed.
                  </p>
                  <br />

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    Most importantly, we preach of our savior, Jesus Christ. We
                    do not make our assistance predicated upon whether they will
                    learn of him or not. We simply make the education available.
                    We hope that the joy they see in us is contagious enough
                    that they are curious to learn about Him.
                  </p>
                  <br />
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    Then arises in them a desire to pay it forward.
                  </p>
                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We firmly believe we will be able to eradicate poverty among
                    the willing in our lifetime. Education transforms quality of
                    life and makes possible a productive, enriched, future free
                    from the bondage of poverty and full of options.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card1.jpg"
                  alt="Our Model"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card2.jpg"
                  alt="Entrepreneurship"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Entrepreneurship
                  </h6>

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We believe that the best way to transform a poor village
                    into a prosperous one is through entrepreneurship. We help
                    develop our mentees' entrepreneurship so they become
                    independent, not beneficiaries, and no longer continue to
                    rely on outside support. Thanks to satellite internet
                    connections and solar power, we can help people in the most
                    remote villages.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Impact
                  </h6>
                  <div>
                    <p className="lato_family" style={{ fontWeight: "300" }}>
                      We contribute our companies' earnings in the following
                      ways:
                    </p>
                    <ul>
                      <li style={{ marginTop: "9px" }}>
                        10% immediately goes to the aid of the people we serve.
                      </li>
                      <li style={{ marginTop: "9px" }}>
                        37% is allocated for taxes.
                      </li>
                      <li style={{ marginTop: "9px" }}>
                        All costs associated with running our companies.
                      </li>
                      <li style={{ marginTop: "9px" }}>
                        Aggressive company growth to increase income, thereby
                        increasing what we contribute to our humanitarian
                        causes.
                      </li>
                      <li style={{ marginTop: "9px" }}>
                        All additional income is donated to P.E.T.E.
                      </li>
                    </ul>
                    <br />
                    <p className="lato_family" style={{ fontWeight: "300" }}>
                      In addition, every dollar we receive in the form of
                      donations or fundraising goes directly to the aid of the
                      people we serve. We do not use it for salaries or for any
                      other purpose, as our salaries and all our other expenses
                      are paid for by our companies' earnings.
                    </p>
                    <br />
                    <p className="lato_family" style={{ fontWeight: "300" }}>
                      Your donations and ours cover all costs associated with
                      educating, training, and providing vital support to our
                      fellow human beings in the most remote areas of our
                      planet.
                    </p>
                    <br />
                    <p className="lato_family" style={{ fontWeight: "300" }}>
                      We are in the business of Poverty Eradication Through
                      Education–the business of Teaching People to Fish.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card3.jpg"
                  alt="Impact"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-10">
              <div className="w-full md:w-1/3 p-4">
                <Image
                  src="/images/philanthropy/card1.jpg"
                  alt="Vision and Mission"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="w-full md:w-1/3 p-4">
                <div>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      fontWeight: "700",
                      textAlign: "start",
                    }}
                  >
                    Vision and Mission
                  </h6>

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We dream of the day when we see poverty eradicated and our
                    fellow human beings thriving, healthy, knowledgeable,
                    well-nourished, well-clothed, and well-sheltered.
                  </p>

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We dream of a day when the poorest and most remote
                    communities are brought to the level of income they need to
                    independently and ongoingly thrive.
                  </p>

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We dream of a day in which educated, and in many cases newly
                    literate, community members join hands with us to pay it
                    forward to other communities and together we join hands to
                    make that happen.
                  </p>

                  <p className="lato_family" style={{ fontWeight: "300" }}>
                    We dream of a day when we see leaders emerging to bring
                    Bible teachings and happiness to their fellow human beings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          paddingBottom: "80px",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          What if…
        </h1>
        <p>
          The journey of a lifetime begins with a single step. Join hands with
          us and let's do this together…
        </p>
        <Link href="/public/contact-us">
          <button
            className="fontquick cursor-pointer font-quicksand py-4 px-9 rounded-md flex text-base leading-4 mt-5 border-none font-normal text-white hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#AF2322",
            }}
          >
            Transform A Human Being's Life...
          </button>
        </Link>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 mt-20">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>
    </div>
  );
};

export default PhilanthropyPage;
