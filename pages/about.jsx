import React from 'react';
// // import "./Home.css";
import Image from 'next/image';
// import Head from 'next/head';

function LandingPage() {
  return (
    <div className="container">
      <header>
        <nav>{/* Navigation bar with BResearch logo and Login/Signup button */}</nav>
      </header>

      {/* First Section */}
      <main>
        <section>
          <div className="image-and-text">
            <div className="text-container">
              <h1 className="header-text">
                Countless Research Opportunities,
                <br />
                All In One Place
              </h1>
              <p className="para-text">
                bResearch is a new web app that connects ucla
                <br />
                students to research opportunities, completely free for
                <br />
                everyone.
              </p>
              <button className="signUp-btn">Sign Up</button>
            </div>
            <div className="img-container">
              <img src="/BaseImage.png" alt="Generic Picture" width={748} height={641} />
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section>
          <div className="image-and-text">
            <div className="img-container">
              <img src="/BaseImage.png" alt="Generic Picture" width={748} height={641} />
            </div>
            <div className="text-container">
              <h1 className="header-text">Tired Of Cold Emailing Professors?</h1>
              <p className="para-text">
                bResearch connects your detailed application to every
                <br />
                professor-- no more lost emails in the pile.
              </p>
            </div>
          </div>
        </section>

        {/* Third Section */}
        <section>
          <div className="image-and-text">
            <div className="text-container">
              <h1 className="header-text">
                Stay Organized In Your Search
                <br />
                For Your Next Research Opportunity.{' '}
              </h1>
              <p className="para-text">
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
            <div className="img-container">
              <img src="/BaseImage.png" alt="Generic Picture" width={748} height={641} />
            </div>
          </div>
        </section>

        <section>
          <button className="createAccount-btn">Create Your Account Now</button>
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
