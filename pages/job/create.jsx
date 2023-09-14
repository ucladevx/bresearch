import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobCreationFormValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import ResearcherSidebar from '../../components/ResearcherSidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

function CreateJobPosting() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: joiResolver(JobCreationFormValidator),
    defaultValues: { description: '<p><br></p>', credit: true, external: false },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    async function getLabs() {
      try {
        const { labs } = await (await fetch('/api/researcher/labs')).json();
        setLabs(labs);
        setValue('lab', labs[0].id, { shouldValidate: true });
      } catch (e) {}
    }
    getLabs();
  }, [setValue]);

  async function onSubmit(data) {
    // e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const { department, external } = data;
    delete data.department;
    delete data.external;
    if (!external) {
      delete data.externalLink;
    }

    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          duration: 'QUARTERLY',
          departments: [department],
          paid: true,
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
            <h1 className="font-bold nocommonligs text-3xl">Create Post</h1>
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
                    <select
                      id="lab"
                      className="border-solid border-2 border-black h-11"
                      {...register('lab', {})}
                    >
                      {labs.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
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
                      error={errors.department}
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
                <div className="flex flex-col gap-9">
                  <Controller
                    control={control}
                    name="external"
                    render={({ field }) => {
                      // console.log({ field, errors }, field.ref.toString());
                      return (
                        <>
                          <div>
                            <input
                              type="radio"
                              id="internal"
                              onBlur={field.onBlur}
                              onChange={() => field.onChange(false)}
                              checked={field.value === false}
                              ref={field.ref}
                            />
                            <label htmlFor="internal" className="checked:bg-black">
                              Through bResearch
                            </label>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div>
                              <input
                                type="radio"
                                id="external"
                                onBlur={field.onBlur}
                                onChange={() => field.onChange(true)}
                                checked={field.value === true}
                                ref={field.ref}
                              />
                              <label htmlFor="external">
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
                        </>
                      );
                    }}
                  />
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
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default CreateJobPosting;
