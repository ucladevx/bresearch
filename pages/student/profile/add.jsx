import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { SecondProfileCreationValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import CreatableSelect from 'react-select/creatable';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function DisabledInput({ id, value, ...props }) {
  if (!id || value === undefined || Object.keys(props).length) {
    throw new Error('Input missing prop or extra prop');
  }
  return (
    <input
      id={id}
      value={value}
      className="border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs border-black"
      disabled
    ></input>
  );
}

function Input({
  id,
  register,
  fieldName,
  registerBody = {},
  error,
  autoFocus,
  maxLength,
  ...props
}) {
  if (!id || !register || !fieldName || Object.keys(props).length) {
    throw new Error('Input missing prop or extra prop');
  }
  return (
    <input
      id={id}
      className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
        error ? 'border-red-600' : 'border-black'
      }`}
      {...register(fieldName, registerBody)}
      autoFocus={autoFocus}
      maxLength={maxLength}
    ></input>
  );
}

function AddToProfile() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);
  const [pdf, setPDF] = useState(null);
  const [pdfError, setPDFError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(SecondProfileCreationValidator) });

  async function onSubmit(data) {
    // e.preventDefault();
    if (!pdf || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    let uploadURL;
    try {
      uploadURL = (
        await (await fetch(`/api/student/profile/upload?size=${pdf.size.toString(10)}`)).json()
      ).url;
    } catch (e) {
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append('Content-Type', 'application/pdf');
    formData.append('pdf', pdf);
    const requests = [
      fetch(uploadURL, {
        method: 'PUT',
        // body: formData,
        body: pdf,
        headers: { 'Content-Type': 'application/pdf' },
      }),
      fetch('/api/student/profile/create2', {
        method: 'POST',
        body: JSON.stringify({ ...data, skills, links }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ];
    try {
      const finishedRequests = await Promise.all(requests);
      for (let i = 0; i < finishedRequests.length; i++) {
        if (finishedRequests[i].status !== 200) {
          return;
        }
      }
      const profileSlug = (await finishedRequests[1].json()).id.replaceAll('-', '');
      await router.push(`/student/profile/${profileSlug}`);
    } catch (e) {}
    setIsSubmitting(false);
  }

  const onDropAccepted = (acceptedFiles) => {
    setPDFError(null);
    setPDF(acceptedFiles[0]);
  };

  const onDropRejected = (rejections) => {
    setPDF(null);
    const error = rejections[0].errors[0].code;
    if (error === 'file-invalid-type') {
      setPDFError("File wasn't a PDF");
    } else if (error === 'file-too-large') {
      setPDFError('PDF was too large (Max 100 KB)');
    } else {
      setPDFError('An error occurred');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: { 'application/pdf': [] },
    maxSize: 102400, // 100 KiB,
    multiple: false,
  });

  return (
    <>
      <Head>
        <title>Add to Profile</title>
      </Head>
    <div className="flex flex-col items-center">
      {/* <main className="max-w-5xl min-w-[80%]"> */}
      <main className="w-[80%] max-w-6xl">
        {/* <main className="max-w-[100rem]"> */}
        {/* TODO: fix above main width */}
        <div className="flex justify-center mb-9 mt-4">
          <h1 className="font-bold nocommonligs text-3xl">Add More Details</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="flex mb-9">
            <h2 className="font-bold text-2xl">Personal Information</h2>
          </div> */}
          <div className="mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="resumeUpload" className="font-bold text-base">
                Resume Upload*
              </label>
              <div className="flex gap-2">
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={
                    'border-dashed border-2 p-5 active:border-blue-500 text-center w-full' +
                    (pdfError ? ' border-red-600' : '')
                  }
                >
                  <input {...getInputProps()} />
                  <p>
                    {pdfError ||
                      (pdf ? (
                        `Successfully attached ${pdf.name}`
                      ) : (
                        <>
                          Click to Upload or Drag and Drop
                          <br />
                          PDF File up to 100 KB
                        </>
                      ))}
                  </p>
                </div>
                <button
                  className={pdf ? '' : 'invisible'}
                  onClick={() => {
                    setPDF(null);
                    setPDFError(null);
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.0699 5.23C19.4599 5.07 17.8499 4.95 16.2299 4.86V4.85L16.0099 3.55C15.8599 2.63 15.6399 1.25 13.2999 1.25H10.6799C8.34991 1.25 8.12991 2.57 7.96991 3.54L7.75991 4.82C6.82991 4.88 5.89991 4.94 4.96991 5.03L2.92991 5.23C2.50991 5.27 2.20991 5.64 2.24991 6.05C2.28991 6.46 2.64991 6.76 3.06991 6.72L5.10991 6.52C10.3499 6 15.6299 6.2 20.9299 6.73C20.9599 6.73 20.9799 6.73 21.0099 6.73C21.3899 6.73 21.7199 6.44 21.7599 6.05C21.7899 5.64 21.4899 5.27 21.0699 5.23Z"
                      fill="#292D32"
                    />
                    <path
                      d="M19.23 8.14C18.99 7.89 18.66 7.75 18.32 7.75H5.67999C5.33999 7.75 4.99999 7.89 4.76999 8.14C4.53999 8.39 4.40999 8.73 4.42999 9.08L5.04999 19.34C5.15999 20.86 5.29999 22.76 8.78999 22.76H15.21C18.7 22.76 18.84 20.87 18.95 19.34L19.57 9.09C19.59 8.73 19.46 8.39 19.23 8.14ZM13.66 17.75H10.33C9.91999 17.75 9.57999 17.41 9.57999 17C9.57999 16.59 9.91999 16.25 10.33 16.25H13.66C14.07 16.25 14.41 16.59 14.41 17C14.41 17.41 14.07 17.75 13.66 17.75ZM14.5 13.75H9.49999C9.08999 13.75 8.74999 13.41 8.74999 13C8.74999 12.59 9.08999 12.25 9.49999 12.25H14.5C14.91 12.25 15.25 12.59 15.25 13C15.25 13.41 14.91 13.75 14.5 13.75Z"
                      fill="#292D32"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="skills" className="font-bold text-base">
                Skills
              </label>
              {/* https://stackoverflow.com/questions/50229792/adding-a-new-line-in-a-jsx-string-inside-a-paragraph-react */}
              <CreatableSelect
                isMulti
                id="skills"
                instanceId="skills"
                // options={[{ option: 'd' }]}
                placeholder=""
                formatCreateLabel={(s) => s}
                // onCreateOption={(s) => {
                //   setSkills((sk) => {
                //     return [...sk, s];
                //   });
                // }}
                // getNewOptionData={(inputVal) => {
                //   console.log({ inputVal }, 'getNew');
                // }}
                isValidNewOption={(s) => s.trim().length > 0}
                onChange={(opt, meta) => {
                  // console.log({ opt, meta });
                  if (meta.action === 'create-option') {
                    setSkills((sk) => [...sk, meta.option.value]);
                  } else if (meta.action === 'pop-value') {
                    setSkills((sk) => sk.slice(0, -1));
                  } else if (meta.action === 'remove-value') {
                    setSkills((sk) => {
                      const skillsCopy = [...sk];
                      const index = skillsCopy.indexOf(meta.removedValue.value);
                      if (index >= 0) {
                        skillsCopy.splice(index, 1);
                      }
                      return skillsCopy;
                    });
                  } else if (meta.action === 'clear') {
                    setSkills([]);
                  }
                }}
                // max={3}
              />
            </div>
            <div
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></div>
            {/* TODO: Use this instead of only using react-select */}
            {/* {skills.map((s) => (
                        <ul key={s}>{s}</ul>
                      ))} */}
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="labExperience" className="text-base">
                <span className="font-bold">Lab Experience</span> (optional)
              </label>
              {/* https://stackoverflow.com/questions/50229792/adding-a-new-line-in-a-jsx-string-inside-a-paragraph-react */}
              <textarea
                id="labExperience"
                className={`border-solid border-2 h-40 text-base px-3 nocommonligs resize-none py-3 rounded ${
                  errors.labExperience ? 'border-red-600' : 'border-black'
                }`}
                {...register('labExperience')}
              ></textarea>
            </div>
            <div
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="relevantCoursework" className="text-base">
                <span className="font-bold">Relevant Coursework</span> (optional)
              </label>
              <textarea
                id="relevantCoursework"
                className={`border-solid border-2 h-40 text-base px-3 nocommonligs resize-none py-3 rounded ${
                  errors.coursework ? 'border-red-600' : 'border-black'
                }`}
                {...register('coursework')}
              ></textarea>
            </div>
            <div
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="links" className="text-base">
                <span className="font-bold">Additional Links</span> (Portfolio, Website, GitHub)
              </label>
              <CreatableSelect
                isMulti
                id="links"
                instanceId="links"
                // options={[{ option: 'd' }]}
                placeholder=""
                formatOptionLabel={({ value }) =>
                  value.startsWith('http') ? value : `https://${value}`
                }
                formatCreateLabel={(s) => (s.startsWith('http') ? s : `https://${s}`)}
                isValidNewOption={(s) => {
                  if (s.trim().length === 0) {
                    return false;
                  }
                  let { error } = SecondProfileCreationValidator.validate({
                    skills: [],
                    links: [s],
                  });
                  if (error) {
                    ({ error } = SecondProfileCreationValidator.validate({
                      skills: [],
                      links: [`https://${s}`],
                    }));
                  }
                  return !error;
                }}
                onChange={(opt, meta) => {
                  // console.log({ opt, meta });
                  if (meta.action === 'create-option') {
                    let { error } = SecondProfileCreationValidator.validate({
                      skills: [],
                      links: [meta.option.value],
                    });
                    if (error) {
                      ({ error } = SecondProfileCreationValidator.validate({
                        skills: [],
                        links: [`https://${meta.option.value}`],
                      }));
                    }
                    if (error) {
                      return;
                    }
                    if (meta.option.value.startsWith('http')) {
                      setLinks((l) => [...l, meta.option.value]);
                    } else {
                      setLinks((l) => [...l, `https://${meta.option.value}`]);
                    }
                  } else if (meta.action === 'pop-value') {
                    setLinks((l) => l.slice(0, -1));
                  } else if (meta.action === 'remove-value') {
                    setLinks((l) => {
                      const linksCopy = [...l];
                      const index = linksCopy.indexOf(meta.removedValue.value);
                      if (index >= 0) {
                        linksCopy.splice(index, 1);
                      }
                      return linksCopy;
                    });
                  } else if (meta.action === 'clear') {
                    setLinks([]);
                  }
                }}
              />
            </div>
            <div
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></div>
          </div>

          <div className="flex justify-end gap-x-3">
            <Link
              href="/"
              className="px-6 py-4 -600 bg-white text-blue-600 border-blue-600 border-2  font-bold text-xl rounded-xl nocommonligs mb-3"
            >
              Skip for now
            </Link>
            <button
              className="px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl nocommonligs mb-3 disabled:opacity-75"
              type="submit"
              disabled={isSubmitting}
            >
              Complete
            </button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
}

export default AddToProfile;
