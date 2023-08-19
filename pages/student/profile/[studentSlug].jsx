import { useEffect, useState } from 'react';
import { UUIDV4Validator } from '@lib/validators';
import prisma from '@lib/prisma';
import NavBar from '../../../components/NavBar';

const pronounsMapping = {
  NOT_LISTED: 'Pronouns not listed',
  HE_HIM: 'he/him',
  SHE_HER: 'she/her',
  THEY_THEM: 'they/them',
};

function StudentProfile({ profile }) {
  const [pdfInfo, setPDFInfo] = useState(null);
  useEffect(() => {
    async function getPDFURL() {
      try {
        const { url, message } = await (
          await fetch(`/api/student/profile/resume/${profile.id}`)
        ).json();
        setPDFInfo(url ? { viewable: true, url } : { viewable: false, message });
      } catch (e) {}
    }
    getPDFURL();
  }, [profile.id]);
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-col items-center pt-[3.25rem] bg-light-gray w-full flex-grow">
        <main className="w-[80%] max-w-6xl flex gap-10">
          <div className="w-[26rem] px-9 py-12 bg-white rounded-[20px] h-fit">
            <ul className="flex flex-col items-center">
              <li className="font-bold text-2xl">
                {profile.firstName} {profile.lastName}
              </li>
              <li className="font-normal text-xl text-[#8B8B8B] mt-2">
                {pronounsMapping[profile.pronouns]}
              </li>
              <li className="self-start ml-2 mt-3">
                <span className="font-bold">Email:</span> {profile.student.email}
              </li>
              <li className="self-start ml-2 mb-3">
                <span className="font-bold">Phone:</span> {profile.phoneNumber}
              </li>
              {profile.bio && <li className="self-start ml-2">{profile.bio}</li>}
            </ul>
          </div>
          <div className="w-[54.125rem] bg-white rounded-[20px] p-5">
            <ul className="flex flex-col items-start">
              <li>
                <span className="font-bold">Major:</span> {profile.major}
              </li>
              <li>
                <span className="font-bold">Minor:</span> {profile.minor ?? 'None'}
              </li>
              <li>
                <span className="font-bold">Expected Graduation:</span> {profile.graduationDate}
              </li>
              <li>
                <span className="font-bold">GPA:</span> {profile.gpa}
              </li>
              <li>
                <span className="font-bold">Major GPA:</span> {profile.majorGpa}
              </li>
            </ul>
            <hr className="my-7" />
            <ul className="flex flex-col items-start gap-9">
              <li>
                {pdfInfo ? (
                  pdfInfo.viewable ? (
                    <a
                      href={pdfInfo.url}
                      rel="noreferrer"
                      target="_blank"
                      className="underline font-bold"
                    >
                      Saved Resume
                    </a>
                  ) : (
                    <>{pdfInfo.message}</>
                  )
                ) : (
                  <div>Loading...</div>
                )}
              </li>
              <li>
                <div className="font-bold">Skills:</div>
                <ul className="flex gap-2 flex-wrap mt-3">
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
              <span className="font-bold">Additional Links</span>
              <br />
              {profile.links.length > 0 ? (
                <ul className="flex flex-col">
                  {profile.links.map((l) => (
                    <a href={l} rel="noreferrer" target="_blank" key={l} className="underline">
                      {l}
                    </a>
                  ))}
                </ul>
              ) : (
                'No Links'
              )}
            </div>
          </div>
        </main>
      </div>
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
        major:
          majorMappings[profile.major] ??
          profile.major.replaceAll('_', ' ').replace(/[A-Z]+/g, function (w) {
            return w[0].toUpperCase() + w.substring(1).toLowerCase();
          }),
        phoneNumber: profile.phoneNumber || 'N/A',
        experience: profile.experience || 'N/A',
        coursework: profile.coursework || 'N/A',
      },
    },
  };
}

export async function getStaticPaths() {
  const profiles = await prisma.StudentProfile.findMany({
    select: {
      id: true,
    },
  });
  const paths = profiles.map(({ id }) => ({
    params: { studentSlug: id.toString(10).replaceAll('-', '') },
  }));

  return { paths, fallback: 'blocking' };
}

export default StudentProfile;
