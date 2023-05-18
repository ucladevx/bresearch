import React from 'react';
import Image from 'next/image';

function LandingPage() {
  return (
    <div className="container">
      <header>
        <nav>{/* Navigation bar with BResearch logo and Login/Signup button */}</nav>
      </header>

      {/* First Section */}
      <main>
        <section>
          <div className="flex items-center">
            <div className="flex-1 p-10 pr-10 pb-30 pl-10 mt-10 mr-20 mb-30 ml-20">
              <h1 className="mt-4 mb-4 text-left text-black text-xl">
                Countless Research Opportunities,
                <br />
                All In One Place
              </h1>
              <p className="mt-4 mb-4 text-left">
                bResearch is a new web app that connects ucla
                <br />
                students to research opportunities, completely free for
                <br />
                everyone.
              </p>
              <button className="mt-24 ml-28 w-28 bg-blue-500 text-white py-4 px-0 text-lg font-medium rounded-md cursor-pointer">
                Sign Up
              </button>
            </div>
            <div className="flex-1">
              <img
                src="/BaseImage.png"
                alt="Generic Picture"
                width={748}
                height={641}
                class="float-right clear-both pt-20 ml-20"
              />
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section>
          <div className="flex items-center">
            <div className="flex-1">
              <img
                src="/BaseImage.png"
                alt="Generic Picture"
                width={748}
                height={641}
                class="float-right clear-both pl-20 pt-20 ml-20"
              />
            </div>
            <div className="flex-1 p-10 pr-5 pb-30 pl-80 mt-10 mr-10 mb-30 ml-10">
              <h1 className="mt-4 mb-4 text-left text-black text-xl">
                Tired Of Cold Emailing Professors?
              </h1>
              <p className="mt-4 mb-4 text-left">
                bResearch connects your detailed application to every
                <br />
                professor-- no more lost emails in the pile.
              </p>
            </div>
          </div>
        </section>

        {/* Third Section */}
        <section>
          <div className="flex items-center">
            <div className="flex-1 p-10 pr-10 pb-30 pl-10 mt-10 mr-20 mb-30 ml-20">
              <h1 className="mt-4 mb-4 text-left text-black text-xl">
                Stay Organized In Your Search
                <br />
                For Your Next Research Opportunity.{' '}
              </h1>
              <p className="mt-4 mb-4 text-left">
                {' '}
                We have developed features such as bookmarking,
                <br />
                application tracking, and a refined filter to help you
                <br />
                optimize your search for your next research
                <br />
                opportunity.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="/BaseImage.png"
                alt="Generic Picture"
                width={748}
                height={641}
                class="float-right clear-both pt-20 ml-20"
              />
            </div>
          </div>
        </section>

        <section>
          <button className="mt-24 ml-96 mb-16 w-60 bg-blue-500 text-white py-4 px-0 text-lg font-medium rounded-md cursor-pointer">
            Create Your Account Now
          </button>
        </section>
      </main>

      <footer>
        {/* <p className='footer'> FAQ|Support Us|Contact
            <br />
            Instagram|Facebook|Twitter|Github
        </p> */}
        {/* Footer content with FAQ|Support Us|Contact|Instagram|Facebook|Twitter|Github*/}
      </footer>
    </div>
  );
}

export default LandingPage;
