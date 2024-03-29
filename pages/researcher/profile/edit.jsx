import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ResearcherProfileCreationValidator } from '@lib/validators';
import { Departments } from '@lib/globals';

function EditResearcherProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({ resolver: joiResolver(ResearcherProfileCreationValidator) });

  useEffect(() => {
    async function getJobInfo() {
      try {
        const profile = await (await fetch('/api/researcher/profile')).json();
        const { researcherProfile, labs } = profile;
        console.log({ researcherProfile, labs });

        const fields = ['firstName', 'lastName'];
        for (const field of fields) {
          setValue(field, researcherProfile[field]);
        }
        setValue('showPicture', researcherProfile.profilePicture !== null);
        setValue('labName', labs[0].name);
        setValue('labContactEmail', labs[0].contactEmail);
        setValue('department', labs[0].department);
      } catch (e) {}
    }
    getJobInfo();
  }, [setValue]);

  const createResearcherProfile = async (data) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/researcher/profile/edit', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        localStorage.setItem('showPicture', data.showPicture);
        await router.push('/profile');
      }
    } catch (e) {}
    setIsSubmitting(false);
  };
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <Head>
        <title>Edit Profile</title>
      </Head>
      <h1 className="flex gap-3 justify-center my-4 font-bold text-[2rem]">Edit Your Profile</h1>
      <div className="w-1/2">
        <form
          className="bg-white rounded-lg backdrop-blur-md border border-solid border-white/10 shadow-lg p-8 flex flex-col justify-center items-left bg-opacity-60 my-20"
          onSubmit={handleSubmit(createResearcherProfile)}
        >
          <label className="block mt-4 text-lg leading-9 text-left text-black">Lab</label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black border border-black rounded-sm pl-2 pt-1"
            id="labName"
            autoFocus={true}
            {...register('labName', {})}
            maxLength={50}
            disabled
          />

          <label htmlFor="department" className="block mt-4 text-lg leading-9 text-left text-black">
            Department
          </label>
          <select
            id="department"
            className="h-8 mb-2 text-black border border-black rounded-sm pl-2"
            {...register('department', {})}
            disabled
          >
            {Departments.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label className="block mt-4 text-lg leading-9 text-left text-black" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
            id="firstName"
            {...register('firstName', {})}
            maxLength={80}
          />
          <label className="block mt-4 text-lg leading-9 text-left text-black" htmlFor="firstName">
            Last Name
          </label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
            id="lastName"
            {...register('lastName', {})}
            maxLength={80}
          />

          <label
            className="block mt-4 text-lg leading-9 text-left text-black"
            htmlFor="labContactEmail"
          >
            Lab Contact Email Address
          </label>
          <input
            type="text"
            className="w-full h-8 mb-6 pb-2 text-black border border-black rounded-sm pl-2 pt-1"
            id="labContactEmail"
            {...register('labContactEmail', {})}
            maxLength={100}
            disabled
          />

          <label className="block mt-4 text-lg leading-9 text-left text-black">
            Show Google Profile Picture
          </label>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="showPicture"
              render={({ field }) => {
                // console.log({ field, errors }, field.ref.toString());
                return (
                  <>
                    <input
                      type="radio"
                      id="showProfilePicture"
                      onBlur={field.onBlur}
                      onChange={() => field.onChange(true)}
                      checked={field.value === true}
                      ref={field.ref}
                    />
                    <label htmlFor="showProfilePicture">Yes</label>

                    <input
                      type="radio"
                      id="hideProfilePicture"
                      onBlur={field.onBlur}
                      onChange={() => field.onChange(false)}
                      checked={field.value === false}
                      ref={field.ref}
                    />
                    <label htmlFor="hideProfilePicture">No</label>
                  </>
                );
              }}
            />
          </div>

          <div className="flex justify-center">
            <button
              className="w-40 bg-blue-800 text-white py-3 text-lg font-semibold rounded-md cursor-pointer disabled:opacity-75"
              type="submit"
              disabled={isSubmitting}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResearcherProfilePage;
