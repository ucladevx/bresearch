import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ProfileCreationValidator } from '@lib/validators';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

// function Input(props) {
//   return (
//     <input
//       {...props}
//       className={`border-solid border-2 border-black h-11 text-base px-3 nocommonligs${
//         props.className ? ` ${props.className}` : ''
//       }`}
//     ></input>
//   );
// }
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

function CreateProfile() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(ProfileCreationValidator) });
  const userSession = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data) {
    // e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/profile/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        await router.push('/student/profile/add');
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  const majors = [{ major: 'COGNITIVE_SCIENCE', text: 'Cognitive Science' }];
  const minors = [{ minor: 'LINGUISTICS', text: 'Linguistics' }];

  return (
    <div className="flex flex-col items-center">
      {/* <main className="max-w-5xl min-w-[80%]"> */}
      <main className="w-[80%] max-w-6xl">
        {/* <main className="max-w-[100rem]"> */}
        {/* TODO: fix above main width */}
        <div className="flex justify-center mb-9 mt-4">
          <h1 className="font-bold nocommonligs text-3xl">Create Profile</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mb-9">
            <h2 className="font-bold text-2xl">Personal Information</h2>
          </div>
          <div className="flex justify-between gap-x-10 gap-y-3 flex-col sm:flex-row mb-9">
            <div className="flex flex-col basis-2/5 shrink-[3] min-w-[6rem] max-w-[22.5rem] gap-y-3">
              <label htmlFor="firstName" className="font-bold text-base">
                First Name*
              </label>
              <Input
                id="firstName"
                autoFocus
                error={errors.firstName}
                register={register}
                fieldName="firstName"
                registerBody={{ required: true }}
                maxLength={80}
              ></Input>
            </div>
            <div className="flex flex-col basis-2/5 shrink-[3] min-w-[6rem] max-w-[22.5rem] gap-y-3">
              <label htmlFor="lastName" className="font-bold text-base">
                Last Name*
              </label>
              <Input
                id="lastName"
                error={errors.lastName}
                register={register}
                fieldName="lastName"
                registerBody={{ required: true }}
                maxLength={80}
              ></Input>
            </div>
            <div className="flex flex-col basis-1/5 shrink-[3] min-w-[6rem] max-w-[15rem] gap-y-3">
              <label htmlFor="pronouns" className="font-bold text-base">
                Pronouns
              </label>
              <select
                id="pronouns"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.pronouns ? 'border-red-600' : 'border-black'
                }`}
                {...register('pronouns')}
              >
                <option value="">Not selected</option>
                <option value="he/him">he/him</option>
                <option>she/her</option>
                <option>they/them</option>
                <option value="NOT_LISTED">Not listed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="accountEmail" className="font-bold text-base">
                UCLA Email
              </label>
              <DisabledInput
                id="accountEmail"
                value={userSession?.data?.user?.email ?? ''}
              ></DisabledInput>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="preferredEmail" className="font-bold text-base">
                Preferred Email (if different from UCLA email)
              </label>
              <Input
                id="preferredEmail"
                error={errors.preferredEmail}
                register={register}
                fieldName="preferredEmail"
                maxLength={100}
              ></Input>
            </div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="phoneNumber" className="font-bold text-base">
                Phone Number (optional)
              </label>
              <Input
                id="phoneNumber"
                error={errors.phoneNumber}
                register={register}
                fieldName="phoneNumber"
                maxLength={15}
              ></Input>
              {errors?.phoneNumber?.message ? (
                <small>Phone Number must only contain digits</small>
              ) : (
                <small aria-hidden={true} className="invisible">
                  _
                </small>
              )}
            </div>
            <input
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></input>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="biography" className="font-bold text-base">
                Bio
              </label>
              {/* https://stackoverflow.com/questions/50229792/adding-a-new-line-in-a-jsx-string-inside-a-paragraph-react */}
              <textarea
                id="biography"
                className={`border-solid border-2 h-40 text-base px-3 nocommonligs resize-none py-3 ${
                  errors.bio ? 'border-red-600' : 'border-black'
                }`}
                placeholder="Tell us a bit about yourself..."
                {...register('bio')}
              ></textarea>
            </div>
            <div
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></div>
          </div>
          <div className="flex mb-9">
            <h2 className="font-bold text-2xl">Educational Information</h2>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="major" className="font-bold text-base">
                Major
              </label>
              <select
                id="major"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.major ? 'border-red-600' : 'border-black'
                }`}
                {...register('major')}
              >
                {majors.map(({ major, text }) => (
                  <option value={major} key={major}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="additionalMajor" className="font-bold text-base">
                Additional Major (if applicable)
              </label>
              <select
                id="additionalMajor"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.additionalMajor ? 'border-red-600' : 'border-black'
                }`}
                {...register('additionalMajor')}
              >
                <option value=""></option>
                {majors.map(({ major, text }) => (
                  <option value={major} key={major}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="minor" className="font-bold text-base">
                Minor
              </label>
              <select
                id="minor"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.minor ? 'border-red-600' : 'border-black'
                }`}
                {...register('minor')}
              >
                <option value=""></option>
                {minors.map(({ minor, text }) => (
                  <option value={minor} key={minor}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="additionalMinor" className="font-bold text-base">
                Additional Minor (if applicable)
              </label>
              <select
                id="additionalMinor"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.additionalMinor ? 'border-red-600' : 'border-black'
                }`}
                {...register('additionalMinor')}
              >
                <option value=""></option>
                {minors.map(({ minor, text }) => (
                  <option value={minor} key={minor}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="graduationDate" className="font-bold text-base">
                Expected Graduation
              </label>
              {/* <Input
                id="graduationDate"
                error={errors.graduationDate}
                register={register}
                fieldName="graduationDate"
                maxLength={15}
              ></Input> */}
              <select
                id="graduationDate"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.graduationDate ? 'border-red-600' : 'border-black'
                }`}
                {...register('graduationDate')}
              >
                {['Select an Option', 'Spring 2023', 'Summer 2023', 'Fall 2023', 'Winter 2024'].map(
                  (minor) => (
                    <option value={minor} key={minor}>
                      {minor}
                    </option>
                  )
                )}
              </select>
            </div>
            <input
              className="basis-1/2 invisible border-solid border-2 border-black"
              aria-hidden="true"
            ></input>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="gpa" className="font-bold text-base">
                GPA (General)*
              </label>
              <Input
                id="gpa"
                error={errors.gpa}
                register={register}
                fieldName="gpa"
                maxLength={5}
              ></Input>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="majorGpa" className="font-bold text-base">
                GPA (Major Specific)*
              </label>
              <Input
                id="majorGpa"
                error={errors.majorGpa}
                register={register}
                fieldName="majorGpa"
                maxLength={5}
              ></Input>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl nocommonligs mb-3 disabled:opacity-75"
              type="submit"
              disabled={isSubmitting}
            >
              Create Profile
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateProfile;
