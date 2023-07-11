import { useEffect, useState } from 'react';
import { UUIDV4Validator } from '@lib/validators';
import prisma from '@lib/prisma';

const pronounsMapping = {
  NOT_LISTED: 'Not Listed',
};

function StudentProfile({ profile }) {
  const [pdfURL, setPDFURL] = useState(null);
  useEffect(() => {
    async function getPDFURL() {
      try {
        const { url } = await (await fetch('/api/student/profile/me')).json();
      } catch (e) {}
      setPDFURL(url);
    }
    getPDFURL();
  });
  return (
    <div className="flex flex-col items-center">
      <main className="w-[80%] max-w-6xl flex mt-5">
        <div className="w-96 p-5">
          <ul className="flex flex-col items-center">
            <li>
              {profile.firstName} {profile.lastName}
            </li>
            <li>Pronouns: {pronounsMapping[profile.pronouns]}</li>
            <li className="self-start ml-2 mt-3">Email: {profile.student.email}</li>
            <li className="self-start ml-2 mb-3">Phone: {profile.phoneNumber}</li>
            {profile.bio && <li className="self-start ml-2">{profile.bio}</li>}
          </ul>
        </div>
        <div className="flex-grow p-5">
          <ul className="flex flex-col items-start">
            <li>Major: {profile.major} </li>
            <li>Minor: {profile.minor ?? 'None'} </li>
            <li>Expected Graduation: {profile.graduationDate} </li>
            <li>GPA: {profile.gpa} </li>
            <li>Major GPA: {profile.majorGpa} </li>
          </ul>
          <hr className="my-7" />
          <ul className="flex flex-col items-start">
            <li>
              {pdfURL ? (
                <a href={pdfURL} rel="noreferrer" target="_blank">
                  Saved Resume
                </a>
              ) : (
                <div>Loading...</div>
              )}
            </li>
            <li>
              Skills:
              <ul className="flex gap-2 flex-wrap">
                {profile.skills.length ? (
                  profile.skills.map((e) => (
                    <li key={e} className="bg-gray-200 px-3 rounded-md">
                      {e}
                    </li>
                  ))
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </li>
          </ul>
          <hr className="my-7" />
          <ul className="flex flex-col items-start">
            <li className="whitespace-pre-wrap mb-6">
              <span className="font-bold mb-4 inline-block">Lab Experience:</span>
              <br className="leading-10" />
              {profile.experience}
            </li>
            <li className="whitespace-pre-wrap">
              <span className="font-bold">Relevant Coursework:</span>
              <br />
              {profile.coursework}
            </li>
          </ul>
          <hr className="my-7" />
          <div>
            Additional Links
            <br />
            {profile.links.length > 0 && (
              <ul className="flex flex-col">
                {profile.links.map((l) => (
                  <a href={l} rel="noreferrer" target="_blank" key={l} className="underline">
                    {l}
                  </a>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const { studentSlug } = context.params;
  if (studentSlug?.length !== 32) {
    return { notFound: true };
  }

  const profileID = `${studentSlug.substring(0, 8)}-${studentSlug.substring(
    8,
    12
  )}-${studentSlug.substring(12, 16)}-${studentSlug.substring(16, 20)}-${studentSlug.substring(
    20,
    32
  )}`;

  const { error } = UUIDV4Validator.validate(profileID);
  if (error) {
    return { notFound: true };
  }

  const profile = await prisma.StudentProfile.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      pronouns: true,
      student: { select: { email: true } },
      phoneNumber: true,
      bio: true,
      major: true,
      minor: true,
      graduationDate: true,
      gpa: true,
      majorGpa: true,
      skills: true,
      experience: true,
      coursework: true,
      links: true,
    },
    where: {
      id: profileID,
    },
  });
  if (!profile) {
    return { notFound: true };
  }

  const majorMappings = {};
  return {
    props: {
      profile: {
        ...profile,
        major: majorMappings[profile.major] ?? profile.major,
        phoneNumber: profile.phoneNumber || 'N/A',
        experience: profile.experience || 'N/A',
        coursework: profile.coursework || 'N/A',
      },
    },
  };
}

export async function getStaticPaths() {
  // returns array containing jobId
  const jobs = await prisma.StudentProfile.findMany({
    select: {
      id: true,
    },
  });
  const paths = jobs.map((job) => ({
    params: { studentSlug: job.id.toString(10).replaceAll('-', '') },
  }));

  return { paths, fallback: 'blocking' };
}

export default StudentProfile;
