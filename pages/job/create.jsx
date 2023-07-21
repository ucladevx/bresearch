import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobCreationFormValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';

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

function CreateJobPosting() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(JobCreationFormValidator) });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data) {
    // e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const tempFutureDate = new Date();
      tempFutureDate.setDate(tempFutureDate.getDate() + 30);
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          duration: 'QUARTERLY',
          departments: [],
          credit: true,
          paid: true,
          closingDate: tempFutureDate,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        await router.push('/jobs');
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col items-center">
      {/* <main className="max-w-5xl min-w-[80%]"> */}
      <main className="w-[80%] max-w-6xl">
        {/* TODO: fix above main width */}
        <div className="flex justify-center mb-9 mt-4">
          <h1 className="font-bold nocommonligs text-3xl">Create Post</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mb-9">
            <h2 className="font-bold text-2xl">Step 1: What lab position do you want to post?</h2>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="lab" className="font-bold text-base">
                Lab*
              </label>
              <select id="lab" disabled></select>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="positionTitle" className="font-bold text-base">
                Position Title*
              </label>
              <Input
                id="positionTitle"
                error={errors.title}
                register={register}
                fieldName="title"
                maxLength={50}
              ></Input>
            </div>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label className="font-bold text-base">Area (General)*</label>
              <select disabled></select>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="location" className="font-bold text-base">
                Location*
              </label>
              <select
                id="location"
                className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                  errors.location ? 'border-red-600' : 'border-black'
                }`}
                {...register('location')}
              >
                <option value="ON_CAMPUS">On Campus</option>
                <option value="OFF_CAMPUS">Off Campus</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col basis-1/2 gap-y-3 mb-9">
            <label htmlFor="description" className="font-bold text-base">
              Description of the Opportunity*
            </label>
            {/* https://stackoverflow.com/questions/50229792/adding-a-new-line-in-a-jsx-string-inside-a-paragraph-react */}
            <textarea
              id="description"
              className={`w-full border-solid border-2 h-40 text-base px-3 nocommonligs resize-none py-3 rounded ${
                errors.description ? 'border-red-600' : 'border-black'
              }`}
              maxLength={15_000}
              {...register('description')}
            ></textarea>
          </div>
          <div className="flex justify-between gap-x-10 mb-9">
            <div className="flex flex-col basis-1/2 gap-y-3">
              <label htmlFor="weeklyHours" className="font-bold text-base">
                Time Commitment Per Week (Hours)
              </label>
              <Input
                id="weeklyHours"
                error={errors.weeklyHours}
                register={register}
                fieldName="weeklyHours"
                maxLength={5}
              ></Input>
            </div>
            <div className="flex flex-col basis-1/2 gap-y-3 invisible">
              <label htmlFor="credit" className="font-bold text-base">
                Research Credit Available*
              </label>
              <div>
                <input
                  type="radio"
                  id="creditAvailable"
                  name="credit"
                  value="true"
                  //   className="hidden checked:bg-dark-blue checked:border-solid checked:border-2"
                />
                <label htmlFor="creditAvailable" className="checked:bg-black">
                  es
                </label>

                <input type="radio" id="creditUnavailable" name="credit" value="false" />
                <label htmlFor="creditUnavailable">No</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl nocommonligs mb-3 disabled:opacity-75"
              type="submit"
              disabled={isSubmitting}
            >
              Create Posting
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateJobPosting;
