import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ResearcherProfileCreationValidator } from '@lib/validators';
import { Departments } from '@lib/globals';

function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: joiResolver(ResearcherProfileCreationValidator) });

  const createResearcherProfile = async (data) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      localStorage.setItem('showPicture', data.showPicture);
      const res = await fetch('/api/researcher/profile/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        await router.push('/posts');
      }
    } catch (e) {}
    setIsSubmitting(false);
  };
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <Head>
        <title>Create Profile</title>
      </Head>
      <h1 className="flex gap-3 justify-center my-8 font-bold text-[2rem]">
        Welcome to
        <svg
          width="164"
          height="41"
          viewBox="0 0 164 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="bResearch"
          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role#svg_and_roleimg
        >
          <path
            d="M59.4383 35.6287C57.4161 36.9752 55.221 37.6484 52.8528 37.6484C51.0253 37.6484 49.3816 37.2714 47.9218 36.5174C46.4728 35.7526 45.3211 34.7131 44.4669 33.399C43.6234 32.0848 43.2017 30.6091 43.2017 28.9718C43.2017 27.4207 43.5801 26.0365 44.3371 24.8193C45.094 23.5913 46.1213 22.6218 47.419 21.9109C48.7274 21.2 50.2035 20.8445 51.8471 20.8445C53.5665 20.8445 55.075 21.2377 56.3726 22.024C57.6703 22.8104 58.6813 23.9037 59.4058 25.304C60.1304 26.7043 60.4926 28.3309 60.4926 30.1836V30.7006H49.6249C49.8196 31.1207 50.0899 31.5031 50.436 31.8478C50.782 32.1818 51.2145 32.451 51.7336 32.6557C52.2526 32.8604 52.8582 32.9627 53.5503 32.9627C55.075 32.9627 56.5186 32.478 57.8811 31.5085L59.4383 35.6287ZM49.3492 28.277H55.0101C54.956 27.7707 54.7993 27.3237 54.5397 26.9359C54.291 26.5481 53.9558 26.2465 53.5341 26.0311C53.1231 25.8049 52.6636 25.6918 52.1553 25.6918C51.6363 25.6918 51.1821 25.8103 50.7928 26.0473C50.4035 26.2842 50.0845 26.5966 49.8358 26.9844C49.5979 27.3722 49.4357 27.803 49.3492 28.277Z"
            fill="#1E2F97"
          />
          <path
            d="M61.7902 35.9519L63.023 31.04C63.315 31.3846 63.7475 31.7186 64.3206 32.0417C64.9046 32.3649 65.5372 32.6288 66.2184 32.8334C66.8997 33.0273 67.5269 33.1243 68.1 33.1243C68.5325 33.1243 68.8623 33.0597 69.0894 32.9304C69.3165 32.8011 69.4301 32.618 69.4301 32.381C69.4301 32.1333 69.3219 31.9232 69.1056 31.7509C68.8894 31.5678 68.5974 31.4008 68.2297 31.25C67.8729 31.0992 67.462 30.943 66.997 30.7814C66.3049 30.5337 65.575 30.2321 64.8072 29.8766C64.0503 29.5104 63.4069 29.0149 62.877 28.3901C62.3471 27.7546 62.0822 26.909 62.0822 25.8534C62.0822 24.8301 62.3526 23.9468 62.8932 23.2035C63.4447 22.4495 64.2179 21.8678 65.2128 21.4585C66.2184 21.0492 67.3971 20.8445 68.7488 20.8445C71.0088 20.8445 73.2851 21.41 75.5776 22.5411L73.9069 27.0813C73.5609 26.7797 73.1067 26.4943 72.5444 26.225C71.9821 25.9557 71.4035 25.7349 70.8088 25.5625C70.2249 25.3902 69.7166 25.304 69.2841 25.304C68.9272 25.304 68.6569 25.3686 68.4731 25.4979C68.3 25.6164 68.2135 25.7833 68.2135 25.9988C68.2135 26.2358 68.3163 26.4458 68.5217 26.6289C68.738 26.8013 69.0245 26.9629 69.3814 27.1137C69.7491 27.2537 70.1492 27.4045 70.5817 27.5661C71.3062 27.8138 72.0524 28.1208 72.8201 28.4871C73.5879 28.8425 74.2367 29.338 74.7666 29.9736C75.3073 30.5983 75.5776 31.4439 75.5776 32.5103C75.5776 33.5551 75.2856 34.4654 74.7017 35.2409C74.1286 36.0057 73.3121 36.5982 72.2524 37.0183C71.2035 37.4384 69.9599 37.6484 68.5217 37.6484C66.1211 37.6484 63.8773 37.0829 61.7902 35.9519Z"
            fill="#1E2F97"
          />
          <path
            d="M93.1119 35.6287C91.0897 36.9752 88.8945 37.6484 86.5264 37.6484C84.6989 37.6484 83.0552 37.2714 81.5954 36.5174C80.1463 35.7526 78.9947 34.7131 78.1404 33.399C77.297 32.0848 76.8752 30.6091 76.8752 28.9718C76.8752 27.4207 77.2537 26.0365 78.0107 24.8193C78.7676 23.5913 79.7949 22.6218 81.0925 21.9109C82.401 21.2 83.877 20.8445 85.5207 20.8445C87.2401 20.8445 88.7486 21.2377 90.0462 22.024C91.3438 22.8104 92.3549 23.9037 93.0794 25.304C93.8039 26.7043 94.1662 28.3309 94.1662 30.1836V30.7006H83.2985C83.4932 31.1207 83.7635 31.5031 84.1095 31.8478C84.4556 32.1818 84.8881 32.451 85.4072 32.6557C85.9262 32.8604 86.5318 32.9627 87.2238 32.9627C88.7486 32.9627 90.1922 32.478 91.5547 31.5085L93.1119 35.6287ZM83.0228 28.277H88.6837C88.6296 27.7707 88.4728 27.3237 88.2133 26.9359C87.9646 26.5481 87.6294 26.2465 87.2076 26.0311C86.7967 25.8049 86.3371 25.6918 85.8289 25.6918C85.3098 25.6918 84.8557 25.8103 84.4664 26.0473C84.0771 26.2842 83.7581 26.5966 83.5094 26.9844C83.2715 27.3722 83.1093 27.803 83.0228 28.277Z"
            fill="#1E2F97"
          />
          <path
            d="M111.992 37.3253H106.753L106.461 35.5479C105.867 36.2265 105.147 36.749 104.304 37.1152C103.46 37.4707 102.541 37.6484 101.546 37.6484C100.433 37.6484 99.4432 37.4384 98.5781 37.0183C97.713 36.5874 97.0318 36.0003 96.5344 35.2571C96.0369 34.5031 95.7882 33.6467 95.7882 32.688C95.7882 31.6755 96.0586 30.7868 96.5992 30.022C97.1399 29.2572 97.8861 28.6594 98.8377 28.2285C99.8001 27.7869 100.898 27.5661 102.13 27.5661C102.801 27.5661 103.46 27.6361 104.109 27.7761C104.758 27.9054 105.391 28.0993 106.007 28.3578V28.0993C106.007 27.6038 105.845 27.1675 105.52 26.7905C105.207 26.4135 104.764 26.1173 104.19 25.9018C103.628 25.6864 102.985 25.5787 102.26 25.5787C101.525 25.5787 100.811 25.6864 100.119 25.9018C99.4378 26.1173 98.8268 26.4243 98.2862 26.8228L96.7614 22.4441C97.9509 21.9163 99.1296 21.5177 100.297 21.2485C101.465 20.9792 102.585 20.8445 103.655 20.8445C105.353 20.8445 106.824 21.173 108.067 21.8301C109.321 22.4764 110.289 23.3974 110.971 24.5931C111.652 25.778 111.992 27.1783 111.992 28.794V37.3253ZM102.925 33.302C103.412 33.302 103.888 33.1943 104.353 32.9789C104.828 32.7634 105.218 32.4887 105.52 32.1548C105.823 31.8209 105.975 31.4816 105.975 31.1369V31.1207C105.585 30.8945 105.153 30.7222 104.677 30.6037C104.201 30.4744 103.725 30.4098 103.25 30.4098C102.568 30.4098 102.028 30.5391 101.628 30.7976C101.238 31.0453 101.044 31.39 101.044 31.8317C101.044 32.1117 101.125 32.3649 101.287 32.5911C101.449 32.8173 101.671 32.995 101.952 33.1243C102.244 33.2428 102.568 33.302 102.925 33.302Z"
            fill="#1E2F97"
          />
          <path
            d="M120.914 37.3253H114.928V21.1677H120.119L120.313 23.7044C120.854 22.7996 121.557 22.0994 122.422 21.6039C123.287 21.0976 124.277 20.8445 125.39 20.8445C125.769 20.8445 126.153 20.8768 126.542 20.9415C126.931 20.9953 127.326 21.0815 127.726 21.2L126.98 26.5643C126.191 26.3058 125.455 26.1765 124.774 26.1765C123.985 26.1765 123.298 26.3435 122.714 26.6774C122.141 27.0006 121.698 27.4584 121.384 28.0508C121.07 28.6432 120.914 29.3488 120.914 30.1674V37.3253Z"
            fill="#1E2F97"
          />
          <path
            d="M144.401 34.5946C143.611 35.5425 142.622 36.2912 141.432 36.8405C140.243 37.3791 138.918 37.6484 137.458 37.6484C135.761 37.6484 134.241 37.2876 132.901 36.5658C131.57 35.8334 130.522 34.837 129.754 33.5767C128.997 32.3056 128.618 30.8622 128.618 29.2465C128.618 27.6307 128.997 26.1927 129.754 24.9324C130.522 23.6613 131.57 22.6649 132.901 21.9432C134.241 21.2107 135.761 20.8445 137.458 20.8445C138.907 20.8445 140.221 21.1138 141.4 21.6524C142.59 22.191 143.579 22.9235 144.368 23.8498L140.881 27.5176C140.546 27.1083 140.108 26.7851 139.567 26.5481C139.037 26.3004 138.48 26.1765 137.896 26.1765C137.291 26.1765 136.75 26.3058 136.274 26.5643C135.799 26.8228 135.425 27.1837 135.155 27.6469C134.885 28.0993 134.75 28.6217 134.75 29.2141C134.75 29.8174 134.885 30.3559 135.155 30.8299C135.425 31.2931 135.799 31.6593 136.274 31.9286C136.75 32.1871 137.291 32.3164 137.896 32.3164C138.48 32.3164 139.043 32.1979 139.583 31.9609C140.124 31.7132 140.557 31.3846 140.881 30.9753L144.401 34.5946Z"
            fill="#1E2F97"
          />
          <path
            d="M146.688 37.3253V13.0889H152.673V22.7188C153.809 21.4693 155.339 20.8445 157.264 20.8445C159.232 20.8445 160.767 21.4693 161.87 22.7188C162.984 23.9575 163.541 25.6864 163.541 27.9054V37.3253H157.556V29.5373C157.556 28.4601 157.345 27.6307 156.923 27.049C156.512 26.4674 155.923 26.1765 155.155 26.1765C154.366 26.1765 153.755 26.4727 153.322 27.0652C152.889 27.6469 152.673 28.4709 152.673 29.5373V37.3253H146.688Z"
            fill="#1E2F97"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.3488 21.0744C9.96272 21.0744 7.21774 23.8087 7.21774 27.1817C7.21774 30.5547 9.96272 33.289 13.3488 33.289C16.7349 33.289 19.4799 30.5547 19.4799 27.1817C19.4799 23.8087 16.7349 21.0744 13.3488 21.0744ZM0.29834 27.1817C0.29834 20.002 6.14124 14.1818 13.3488 14.1818C20.5564 14.1818 26.3993 20.002 26.3993 27.1817C26.3993 34.3614 20.5564 40.1816 13.3488 40.1816C6.14124 40.1816 0.29834 34.3614 0.29834 27.1817Z"
            fill="#1E2F97"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.85756 3.93933C5.82326 3.93933 7.41678 5.48142 7.41678 7.38367V26.4949C7.41678 28.3971 5.82326 29.9392 3.85756 29.9392C1.89186 29.9392 0.29834 28.3971 0.29834 26.4949V7.38367C0.29834 5.48142 1.89186 3.93933 3.85756 3.93933Z"
            fill="#1E2F97"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M31.1211 7.96186C28.2302 6.21375 24.0029 6.8696 21.4708 10.0697C20.2766 11.5788 18.1034 11.8195 16.6168 10.6073C15.1301 9.39514 14.893 7.18905 16.0871 5.67992C20.6426 -0.0772336 28.6274 -1.70468 34.6542 1.93907C39.7131 4.99673 42.3844 11.2097 41.1125 17.1332C40.2906 20.9595 38.0991 23.5319 36.1317 25.1417C36.1708 25.1987 36.21 25.2558 36.2491 25.3128C37.4892 27.1201 38.7283 28.926 39.9692 30.732C41.06 32.3197 40.6765 34.5044 39.1125 35.6118C37.5484 36.7191 35.3963 36.3298 34.3054 34.7421C33.0633 32.9344 31.8215 31.1245 30.5801 29.3153C29.8493 28.2502 29.1186 27.1854 28.3882 26.1214C27.7897 25.2495 27.6131 24.149 27.9083 23.1294C28.2034 22.1098 28.9383 21.2812 29.9063 20.8766C30.2479 20.7338 33.6052 19.18 34.3656 15.6402M31.1211 7.96186C33.6179 9.47072 35.0072 12.6516 34.3656 15.6402L31.1211 7.96186Z"
            fill="#85BDE5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.2891 13.7072C25.9228 13.9729 25.7115 14.2525 25.7049 14.2613C25.7047 14.2615 25.7047 14.2616 25.7047 14.2615C25.1862 14.9688 24.0967 15.1819 23.2712 14.7376C22.4457 14.2933 22.197 13.3598 22.7155 12.6525C22.8147 12.5172 23.2513 11.9476 24.0081 11.3987C24.7661 10.8487 25.9675 10.2345 27.5446 10.2424L27.5467 10.2424C28.8312 10.2501 29.801 10.6699 30.3049 10.9355C31.1351 11.3733 31.394 12.3048 30.8831 13.0162C30.3722 13.7276 29.285 13.9493 28.4548 13.5116C28.2449 13.401 27.9168 13.2697 27.523 13.2671C27.0746 13.2651 26.6623 13.4365 26.2891 13.7072Z"
            fill="#85BDE5"
          />
        </svg>
      </h1>
      <div className="w-1/2">
        <form
          className="bg-white rounded-lg backdrop-blur-md border border-solid border-white/10 shadow-lg p-8 flex flex-col justify-center items-left bg-opacity-60 my-20"
          onSubmit={handleSubmit(createResearcherProfile)}
        >
          <center>
            <h1 className="text-2xl font-bold mt-0 rounded-sm py-1 px-1 text-blue-800">
              Getting Started
            </h1>
          </center>

          <label className="block mt-4 text-lg leading-9 text-left text-black">Lab</label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
            id="labName"
            autoFocus={true}
            {...register('labName', {})}
            maxLength={50}
          />

          <label htmlFor="department" className="block mt-4 text-lg leading-9 text-left text-black">
            Department
          </label>
          <select
            id="department"
            className="h-8 mb-2 text-black bg-white border border-black rounded-sm pl-2"
            {...register('department', {})}
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
            className="w-full h-8 mb-6 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
            id="labContactEmail"
            {...register('labContactEmail', {})}
            maxLength={100}
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
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
