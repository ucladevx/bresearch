import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { SecondProfileCreationValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(SecondProfileCreationValidator) });

  async function onSubmit(data) {
    // e.preventDefault();
    if (!pdf) {
      return;
    }
    let uploadURL;
    try {
      uploadURL = (
        await (await fetch(`/api/student/profile/upload?size=${pdf.size.toString(10)}`)).json()
      ).url;
    } catch (e) {
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
  }

  const majors = [{ major: 'COGNITIVE_SCIENCE', text: 'Cognitive Science' }];
  const minors = [{ minor: 'LINGUISTICS', text: 'Linguistics' }];

  // console.log(errors?.phoneNumber?.message, '1234', errors);
  const onDrop = (acceptedFiles) => {
    setPDF(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    maxSize: 102400, // 100 KiB,
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center">
      {skills.map((s) => (
        <ul key={s}>{s}</ul>
      ))}
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
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="resumeUpload" className="font-bold text-base">
                Resume Upload*
              </label>
              <div
                {...getRootProps({ className: 'dropzone' })}
                className="border-dashed border-2 p-5 focus:border-blue-500"
              >
                <input {...getInputProps()} />
                <p>Click to Upload or Drag and Drop</p>
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
              <label htmlFor="links" className="text-base">
                <span className="font-bold">Additional Links</span> (Portfolio, Website, GitHub)
              </label>
              <CreatableSelect
                isMulti
                id="links"
                instanceId="links"
                // options={[{ option: 'd' }]}
                placeholder=""
                formatCreateLabel={(s) => s}
                isValidNewOption={(s) => {
                  if (s.trim().length === 0) {
                    return false;
                  }
                  const { error } = SecondProfileCreationValidator.validate({
                    skills: [],
                    links: [s],
                    labExperience: '',
                    coursework: '',
                  });
                  if (error) {
                    return false;
                  }
                  return true;
                }}
                onChange={(opt, meta) => {
                  // console.log({ opt, meta });
                  if (meta.action === 'create-option') {
                    const { error } = SecondProfileCreationValidator.validate({
                      skills: [],
                      links: [meta.option.value],
                      labExperience: '',
                      coursework: '',
                    });
                    // console.log({ error, links });
                    if (error) {
                      return;
                    }
                    setLinks((l) => [...l, meta.option.value]);
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
              className="px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl nocommonligs mb-3"
              type="submit"
            >
              Complete
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddToProfile;
