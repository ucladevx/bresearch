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
        <section className="grid grid-cols-2 gap-10 items-center">
          <div className="p-10">
            <h1 className="mt-4 mb-4 text-black text-xl">
              Countless Research Opportunities,
              <br />
              All In One Place
            </h1>
            <p className="mt-4 mb-4">
              bResearch is a new web app that connects UCLA
              <br />
              students to research opportunities, completely free for
              <br />
              everyone.
            </p>
            <button className="mt-24 w-28 bg-blue-500 text-white py-4 px-0 text-lg font-medium rounded-md cursor-pointer">
              Sign Up
            </button>
          </div>
          <div>
            <img
              src="/BaseImage.png"
              alt="Generic Picture"
              width={748}
              height={641}
              className="float-right clear-both pt-20"
            />
          </div>
        </section>

        {/* Second Section */}
        <section className="grid grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="/BaseImage.png"
              alt="Generic Picture"
              width={748}
              height={641}
              className="float-right clear-both pl-20 pt-20"
            />
          </div>
          <div className="p-10">
            <h1 className="mt-4 mb-4 text-black text-xl">Tired Of Cold Emailing Professors?</h1>
            <p className="mt-4 mb-4">
              bResearch connects your detailed application to every
              <br />
              professor-- no more lost emails in the pile.
            </p>
          </div>
        </section>

        {/* Third Section */}
        <section className="grid grid-cols-2 gap-10 items-center">
          <div className="p-10">
            <h1 className="mt-4 mb-4 text-black text-xl">
              Stay Organized In Your Search
              <br />
              For Your Next Research Opportunity.{' '}
            </h1>
            <p className="mt-4 mb-4">
              We have developed features such as bookmarking,
              <br />
              application tracking, and a refined filter to help you
              <br />
              optimize your search for your next research
              <br />
              opportunity.
            </p>
          </div>
          <div>
            <img
              src="/BaseImage.png"
              alt="Generic Picture"
              width={748}
              height={641}
              className="float-right clear-both pt-20"
            />
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
