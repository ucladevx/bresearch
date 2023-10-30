import Image from 'next/image';
import Link from 'next/link';
import aboutPic1 from '/Users/rohangandhi/Downloads/BResearch/bresearch/public/aboutPic1.svg';
import aboutPic2 from '/Users/rohangandhi/Downloads/BResearch/bresearch/public/aboutPic2.svg';
import aboutPic3 from '/Users/rohangandhi/Downloads/BResearch/bresearch/public/aboutPic3.svg';
import logo from '/Users/rohangandhi/Downloads/BResearch/bresearch/public/logo.svg';

function Navbar() {
  return (
    <nav className="bg-white p-4 w-screen">
      <div className="flex justify-between items-center">
        <Image src={logo} alt="Generic Picture" width={100} height={400} />
        <Link
          href="/api/auth/signin"
          className="bg-blue-500 text-white py-2 px-8 text-lg font-medium rounded-md cursor-pointer ml-auto mr-10"
        >
          Log in / Sign Up
        </Link>
      </div>
    </nav>
  );
}

function LandingPage() {
  return (
    <div className="container">
      <header>
        <Navbar>{/* Navigation bar with BResearch logo and Login/Signup button */}</Navbar>
      </header>

      {/* First Section */}
      <main>
        <section>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-10 pr-10 pb-30 pl-10 mt-10 mr-20 mb-30 ml-20">
              <h1 className="mt-4 mb-4 text-left text-xl font-semibold">
                Countless Research Opportunities,
                <br />
                All In One Place
              </h1>
              <p className="mt-4 mb-4 text-left font-medium">
                bResearch is a new web app that connects UCLA
                <br />
                students to research opportunities, completely free for
                <br />
                everyone.
              </p>
              <Link
                href="/api/auth/signin"
                className="mt-24 ml-28 w-28 bg-blue-500 text-white py-4 px-10 text-lg font-medium rounded-md cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
            <div className="flex-1">
              <Image
                src={aboutPic1}
                alt="Generic Picture"
                width={748}
                height={641}
                className="float-right clear-both pt-20 ml-20"
              />
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Image
                src={aboutPic2}
                alt="Generic Picture"
                width={748}
                height={700}
                className="float-right clear-both pl-20 pt-20 ml-20"
              />
            </div>
            <div className="flex-1 p-10 pr-5 pb-30 pl-80 mt-10 mr-10 mb-30 ml-10">
              <h1 className="mt-4 mb-4 text-left text-xl font-semibold">
                Tired of Cold Emailing Professors?
              </h1>
              <p className="mt-4 mb-4 text-left font-medium">
                bResearch connects your detailed application to every
                <br />
                professor&mdash;no more lost emails in the pile.
              </p>
            </div>
          </div>
        </section>

        {/* Third Section */}
        <section>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-10 pr-10 pb-30 pl-10 mt-10 mr-20 mb-30 ml-20">
              <h1 className="mt-4 mb-4 text-left text-xl font-semibold">
                Stay Organized in Your Search
                <br />
                For Your Next Research Opportunity.
              </h1>
              <p className="mt-4 mb-4 text-left font-medium">
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
              <Image
                src={aboutPic3}
                alt="Generic Picture"
                width={748}
                height={641}
                className="float-right clear-both pt-20 ml-20"
              />
            </div>
          </div>
        </section>

        <section className="flex justify-center">
          <Link
            href="/api/auth/signin"
            className="mt-24 mb-16 w-60 bg-blue-500 text-white py-4 text-lg font-medium rounded-md cursor-pointer text-center"
          >
            Create Your Account Now
          </Link>
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
