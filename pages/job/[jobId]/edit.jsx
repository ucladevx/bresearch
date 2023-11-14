import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobCreationFormValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import ResearcherSidebar from '../../../components/ResearcherSidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Departments, Durations } from '@lib/globals';

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

function DisabledInput({ id, value, ...props }) {
  if (!id || Object.keys(props).length) {
    throw new Error('Input missing prop or extra prop');
  }
  return (
    <input
      id={id}
      className="border-solid border-2 h-11 text-base px-3 nocommonligs border-black"
      value={value}
      disabled
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
    resolver: joiResolver(JobCreationFormValidator),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobInfo, setJobInfo] = useState(null);

  useEffect(() => {
    async function getJobInfo() {
      if (jobId === undefined) {
        return;
      }
      try {
        const jobInfo = await (await fetch(`/api/jobs/${jobId}`)).json();
        // console.log({ jobInfo });
        setJobInfo(jobInfo);
        const fields = ['title', 'description', 'location', 'duration', 'paid'];
        for (const field of fields) {
          setValue(field, jobInfo[field]);
        }
        setValue('credit', jobInfo.credit !== null);
        if (jobInfo.credit !== null) {
          setValue('creditDescription', jobInfo.credit);
        }
        setValue('weeklyHours', jobInfo.weeklyHours.toString(10));
        setValue('startDate', new Intl.DateTimeFormat('en-US').format(new Date(jobInfo.startDate)));
        setValue(
          'closingDate',
          new Intl.DateTimeFormat('en-US').format(new Date(jobInfo.closingDate))
        );
        setValue('lab', jobInfo.labId);
        setValue('department', jobInfo.departments[0]);
        if (jobInfo.externalLink === null) {
          setValue('applicationType', 'internal');
        } else {
          const externalLinkSchema = JobCreationFormValidator.extract('externalLink');
          const { error } = externalLinkSchema.validate(jobInfo.externalLink);
          if (error) {
            // email
            setValue('applicationType', 'email');
          } else {
            // link
            setValue('applicationType', 'external');
            setValue('externalLink', jobInfo.externalLink);
          }
          // console.log({ error });
        }
      } catch (e) {}
    }
    getJobInfo();
  }, [jobId, setValue]);

  async function closeJob() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/close`, {
        method: 'PATCH',
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
      const { department, applicationType, credit } = data;
      delete data.department;
      delete data.credit;
      if (applicationType === 'internal' || applicationType === 'email') {
        delete data.externalLink;
      }
      if (!credit) {
        delete data.creditDescription;
      }

      const res = await fetch(`/api/jobs/${jobId}/edit`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          // closingDate: new Date(data.closingDate),
          departments: [department],
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
      <div className="flex flex-col items-center ml-[15.5rem] bg-light-gray">
        {/* <main className="max-w-5xl min-w-[80%]"> */}
        <main className="w-[80%] max-w-6xl">
          {/* TODO: fix above main width */}
          <div className="flex justify-center mb-9 mt-4">
            <h1 className="font-bold nocommonligs text-3xl">Edit Post</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-9">
              <div className="p-12 bg-white rounded-[20px]">
                <div className="flex mb-9">
                  <h2 className="font-bold text-2xl">
                    Step 1: What lab position do you want to post?
                  </h2>
                </div>
                <div className="flex justify-between gap-x-10 mb-9">
                  <div className="flex flex-col basis-1/2 gap-y-3">
                    <label htmlFor="lab" className="font-bold text-base">
                      Lab*
                    </label>
                    <DisabledInput id="lab" value={jobInfo?.lab?.name ?? ''} />
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
                    <label className="font-bold text-base">Department (General)*</label>
                    <select
                      id="department"
                      // className="h-8 mb-2 text-black bg-white border border-black rounded-sm pl-2"
                      className={`border-solid border-2 h-11 text-base px-3 nocommonligs ${
                        errors.department ? 'border-red-600' : 'border-black'
                      }`}
                      {...register('department', {})}
                    >
                      {Departments.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col basis-1/2 gap-y-3">
                    <label htmlFor="location" className="font-bold text-base">
                      Location*
                    </label>
                    <select
                      id="location"
                      className={`border-solid border-2 h-11 text-base px-3 nocommonligs ${
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
                              [
                                'bold',
                                'italic',
                                'underline',
                                { list: 'bullet' },
                                { list: 'ordered' },
                              ],
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
                      Time Commitment Per Week (Hours)*
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
                    <div className="flex flex-col gap-2 ">
                      <Controller
                        control={control}
                        name="credit"
                        render={({ field }) => {
                          // console.log({ field, errors }, field.ref.toString());
                          return (
                            <>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  id="creditAvailable"
                                  onBlur={field.onBlur}
                                  onChange={() => field.onChange(true)}
                                  checked={field.value === true}
                                  ref={field.ref}

                                  //   className="hidden checked:bg-dark-blue checked:border-solid checked:border-2"
                                />
                                <label htmlFor="creditAvailable">Yes</label>
                                <Input
                                  id="creditDescription"
                                  // className="flex-grow"
                                  register={register}
                                  fieldName="creditDescription"
                                  maxLength={40}
                                  placeholder="Ex. Course: SRP 99"
                                />
                              </div>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  id="creditUnavailable"
                                  onBlur={field.onBlur}
                                  onChange={() => field.onChange(false)}
                                  checked={field.value === false}
                                  ref={field.ref}
                                  // className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                                  //   errors.credit ? 'border-red-600' : 'border-black'
                                  // }`}
                                />
                                <label htmlFor="creditUnavailable">No</label>
                              </div>
                            </>
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-x-10 mb-9">
                  <div className="flex flex-col basis-1/2 gap-y-3">
                    <label htmlFor="duration" className="font-bold text-base">
                      Duration*
                    </label>
                    <select
                      id="duration"
                      className={`border-solid border-2 h-11 text-base px-3 nocommonligs ${
                        errors.duration ? 'border-red-600' : 'border-black'
                      }`}
                      {...register('duration', {})}
                    >
                      {Durations.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col basis-1/2 gap-y-3">
                    <label htmlFor="paid" className="font-bold text-base">
                      Paid
                    </label>
                    <div className="flex gap-2 h-full">
                      <Controller
                        control={control}
                        name="paid"
                        render={({ field }) => {
                          // console.log({ field, errors }, field.ref.toString());
                          return (
                            <>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  id="paidPosition"
                                  onBlur={field.onBlur}
                                  onChange={() => field.onChange(true)}
                                  checked={field.value === true}
                                  ref={field.ref}

                                  //   className="hidden checked:bg-dark-blue checked:border-solid checked:border-2"
                                />
                                <label htmlFor="paidPosition">Yes</label>
                              </div>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  id="unpaidPosition"
                                  onBlur={field.onBlur}
                                  onChange={() => field.onChange(false)}
                                  checked={field.value === false}
                                  ref={field.ref}
                                  // className={`border-solid border-2 h-11 text-base px-3 focus:outline-none nocommonligs ${
                                  //   errors.credit ? 'border-red-600' : 'border-black'
                                  // }`}
                                />
                                <label htmlFor="unpaidPosition">No</label>
                              </div>
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
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <div>
                          {/* div is to prevent extra flex gap when DatePicker is made up of two elements */}
                          <DatePicker
                            placeholderText="Select start date"
                            onChange={(date) =>
                              field.onChange(new Intl.DateTimeFormat('en-US').format(date))
                            }
                            onBlur={field.onBlur}
                            selected={field.value && new Date(field.value)}
                            dateFormat="MMM dd, yyyy"
                            wrapperClassName="w-full"
                            className="border-solid border-2 border-black focus:outline-none w-full p-3 h-11"
                            calendarClassName="!font-sans"
                            ref={(elem) => {
                              // https://github.com/orgs/react-hook-form/discussions/5413#discussioncomment-805331
                              elem && field.ref(elem.input);
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex flex-col basis-1/2 gap-y-3">
                    <label htmlFor="applicationDeadlineDate" className="font-bold text-base">
                      Deadline To Apply*
                    </label>
                    <Controller
                      control={control}
                      name="closingDate"
                      render={({ field }) => (
                        <div className="font-sans">
                          {/* div is to prevent extra flex gap when DatePicker is made up of two elements */}
                          <DatePicker
                            placeholderText="Select deadline date"
                            onChange={(date) =>
                              field.onChange(new Intl.DateTimeFormat('en-US').format(date))
                            }
                            onBlur={field.onBlur}
                            selected={field.value && new Date(field.value)}
                            minDate={new Date()}
                            dateFormat="MMM dd, yyyy"
                            wrapperClassName="w-full"
                            className="border-solid border-2 border-black focus:outline-none w-full p-3 h-11"
                            calendarClassName="!font-sans"
                            ref={(elem) => {
                              // https://github.com/orgs/react-hook-form/discussions/5413#discussioncomment-805331
                              elem && field.ref(elem.input);
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="p-12 bg-white rounded-[20px]">
                <div className="flex mb-9">
                  <h2 className="font-bold text-2xl">
                    Step 2: How would you like to receive applications?*
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  <Controller
                    control={control}
                    name="applicationType"
                    render={({ field }) => {
                      // console.log({ field, errors }, field.ref.toString());
                      return (
                        <>
                          <div className="flex gap-2 items-center">
                            <input
                              type="radio"
                              id="internalApplication"
                              onBlur={field.onBlur}
                              onChange={() => field.onChange('internal')}
                              checked={field.value === 'internal'}
                              ref={field.ref}
                            />
                            <label htmlFor="internalApplication" className="checked:bg-black">
                              Through bResearch
                            </label>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                              <input
                                type="radio"
                                id="externalApplication"
                                onBlur={field.onBlur}
                                onChange={() => field.onChange('external')}
                                checked={field.value === 'external'}
                                ref={field.ref}
                              />
                              <label htmlFor="externalApplication">
                                Direct Applicants to An External Link To Apply
                              </label>
                            </div>
                            <Input
                              id="externalLink"
                              register={register}
                              fieldName="externalLink"
                              maxLength={200}
                            ></Input>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                              <input
                                type="radio"
                                id="emailApplication"
                                onBlur={field.onBlur}
                                onChange={() => field.onChange('email')}
                                checked={field.value === 'email'}
                                ref={field.ref}
                              />
                              <label htmlFor="emailApplication">Lab Contact Email Address</label>
                            </div>
                            <DisabledInput
                              id="labContactEmail"
                              value={jobInfo?.lab?.contactEmail ?? ''}
                            ></DisabledInput>
                          </div>
                        </>
                      );
                    }}
                  />
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
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default EditJobPosting;
