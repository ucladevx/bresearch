import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobCreationFormValidator } from '@lib/validators';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

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
    control,
  } = useForm({
    resolver: joiResolver(JobCreationFormValidator),
    defaultValues: { description: '<p><br></p>' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    async function getLabs() {
      try {
        const { labs } = await (await fetch('/api/researcher/labs')).json();
        setLabs(labs);
      } catch (e) {}
    }
    getLabs();
  }, []);
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
