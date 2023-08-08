import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobEditFormValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import ResearcherSidebar from '../../../components/ResearcherSidebar';

// https://github.com/zenoamaro/react-quill/issues/718#issuecomment-873541445
// https://github.com/zenoamaro/react-quill/issues/596#issuecomment-1207420071
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);

function Input({
  id,
  register,
  fieldName,
  registerBody = {},
  error,
  autoFocus,
  maxLength,
  placeholder,
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
      placeholder={placeholder}
    ></input>
  );
}

function EditJobPosting() {
  const router = useRouter();
  const { jobId } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: joiResolver(JobEditFormValidator),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobInfo, setJobInfo] = useState(null);

  useEffect(() => {
    async function getLabs() {
      if (jobId === undefined) {
        return;
      }
      try {
        const jobInfo = await (await fetch(`/api/jobs/${jobId}`)).json();
        setJobInfo(jobInfo);
        const fields = ['title', 'description', 'credit', 'location'];
        for (const field of fields) {
          setValue(field, jobInfo[field]);
        }
        setValue('weeklyHours', jobInfo.weeklyHours.toString(10));
        setValue(
          'closingDate',
          new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(jobInfo.closingDate))
        );
      } catch (e) {}
    }
    getLabs();
  }, [jobId, setValue]);
  async function closeJob() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/edit`, {
        method: 'PATCH',
        body: JSON.stringify({
          closed: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        await router.push('/posts');
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  async function onSubmit(data) {
    // e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      delete data.department;
      delete data.startDate;
      const res = await fetch(`/api/jobs/${jobId}/edit`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...data,
          closingDate: new Date(data.closingDate),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        await router.push('/posts');
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  return (
    <>
      <ResearcherSidebar />
      <div className="flex flex-col items-center ml-[15.5rem]">
        {/* <main className="max-w-5xl min-w-[80%]"> */}
        <main className="w-[80%] max-w-6xl">
          {/* TODO: fix above main width */}
          <div className="flex justify-center mb-9 mt-4">
            <h1 className="font-bold nocommonligs text-3xl">Edit Post</h1>
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
                <div id="lab" className="border-solid border-2 border-black h-11">
                  {jobInfo && jobInfo.lab.name}
                </div>
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
                <Input
                  id="jobArea"
                  register={register}
                  fieldName="department"
                  maxLength={50}
                ></Input>
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
              <Controller
                control={control}
                name="description"
                render={({ field }) => {
                  // console.log({ field, errors }, field.ref.toString());
                  return (
                    <ReactQuill
                      {...field} // https://github.com /zenoamaro/react-quill/issues/642#issuecomment-717661518
                      ref={undefined} // errors on .focus() if ref is passed
                      forwardedRef={field.ref}
                      defaultValue="<p><br></p>"
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline', { list: 'bullet' }, { list: 'ordered' }],
                        ],
                      }}
                      formats={['bold', 'italic', 'underline', 'list', 'strong']}
                      style={{
                        border: errors.description ? '2px solid red' : '2px solid black',
                      }}
                      className="nocommonligs"
                    />
                  );
                }}
              />
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
              <div className="flex flex-col basis-1/2 gap-y-3">
                <label htmlFor="credit" className="font-bold text-base">
                  Research Credit Available*
                </label>
                <div>
                  <Controller
                    control={control}
                    name="credit"
                    render={({ field }) => {
                      // console.log({ field, errors }, field.ref.toString());
                      return (
                        <>
                          <input
                            type="radio"
                            id="creditAvailable"
                            // name="credit"
                            // value="true"
                            onBlur={field.onBlur}
                            onChange={() => field.onChange(true)}
                            checked={field.value === true}
                            ref={field.ref}

                            //   className="hidden checked:bg-dark-blue checked:border-solid checked:border-2"
                          />
                          <label htmlFor="creditAvailable" className="checked:bg-black">
                            Yes
                          </label>

                          <input
                            type="radio"
                            id="creditUnavailable"
                            // name="credit"
                            // value="false"
                            onBlur={field.onBlur}
                            onChange={() => field.onChange(false)}
                            checked={field.value === false}
                            ref={field.ref}
                            // className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                            //   errors.credit ? 'border-red-600' : 'border-black'
                            // }`}
                          />
                          <label htmlFor="creditUnavailable">No</label>
                        </>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-x-10 mb-9">
              <div className="flex flex-col basis-1/2 gap-y-3">
                <label htmlFor="startDate" className="font-bold text-base">
                  Start Date*
                </label>
                <Input
                  id="startDate"
                  // error={errors.startDate}
                  register={register}
                  fieldName="startDate"
                  maxLength={50}
                  placeholder="MM/DD/YYYY"
                ></Input>
              </div>
              <div className="flex flex-col basis-1/2 gap-y-3">
                <label htmlFor="applicationDeadlineDate" className="font-bold text-base">
                  Deadline To Apply*
                </label>
                <Input
                  id="applicationDeadlineDate"
                  // error={errors.closingDate}
                  register={register}
                  fieldName="closingDate"
                  maxLength={50}
                  placeholder="MM/DD/YYYY"
                ></Input>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="px-6 py-4 bg-[#E53939] text-white font-bold text-xl rounded-xl nocommonligs mb-3 disabled:opacity-75"
                disabled={isSubmitting}
                onClick={closeJob}
              >
                Stop Receiving Applications
              </button>
              <button
                className="px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl nocommonligs mb-3 disabled:opacity-75"
                type="submit"
                disabled={isSubmitting}
              >
                Publish Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default EditJobPosting;
