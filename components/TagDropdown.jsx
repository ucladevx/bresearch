import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//TODO:
//Fix: Dropdown overlap/scroll behavior - probably want to use a portal so it renders over the parent table
//Fix: Rejected should say Not Accepted, need to make an exception case for it

export default function TagDropdown(props) {
  const { piStatus, applicantEmail } = props;
  const [bgColor, setBgColor] = useState(updateTextColor(piStatus));
  const [textColor, setTextColor] = useState(updateBgColor(piStatus));
  const [tag, setTag] = useState(piStatus);
  const router = useRouter();

  //Run patch request
  function updateTextColor(tag) {
    switch (tag) {
      //The following text and color are for the dropdown button, might be a better way to set these values but this is simple
      case 'CONSIDERING':
        return 'text-[#1E2F97]';
      case 'ACCEPTED':
        return 'text-[#29570D]';
      case 'REVIEWING':
        return 'text-[#653D00]';
      case 'REJECTED':
        return 'text-[#570D0D]';
      case 'INTERVIEWING':
        return 'text-[#2A0062]';
      case 'JOINED':
        return 'text-[#141466]';
    }
  }

  function updateBgColor(tag) {
    switch (tag) {
      //The following text and color are for the dropdown button, might be a better way to set these values but this is simple
      case 'CONSIDERING':
        return 'bg-light-blue bg-opacity-30 hover:bg-light-blue hover:bg-opacity-50';
      case 'ACCEPTED':
        return 'bg-light-green bg-opacity-40 hover:bg-light-green hover:bg-opacity-60';
      case 'REVIEWING':
        return 'bg-[#fea31c] bg-opacity-20 hover:bg-[#fea31c] hover:bg-opacity-30';
      case 'REJECTED':
        return 'bg-[#E53939] bg-opacity-20 hover:bg-[#E53939] hover:bg-opacity-40';
      case 'INTERVIEWING':
        return 'bg-[#6f32be] bg-opacity-20 hover:bg-[#6f32be] hover:bg-opacity-30';
      case 'JOINED':
        return 'bg-[#1E2F97] bg-opacity-20 hover:bg-[#1E2F97] hover:bg-opacity-30';
    }
  }

  function updateTag(tag) {
    setTag(tag);
    const { jobId } = router.query;
    fetch(`/api/applications/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicantEmail: applicantEmail,
        status: tag,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setTextColor(updateTextColor(tag));
    setBgColor(updateBgColor(tag));
  }

  const buttonStyle =
    'inline-flex  justify-center gap-x-1.5 rounded-full px-3 py-1 text-sm font-semibold shadow-sm';

  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button
        //Changing button color based on the current selection
        className={`${textColor} ${bgColor} ${buttonStyle} w-full `}
      >
        {tag}
        <ChevronDownIcon
          className={`-mr-1 -ml-1 h-5 w-5 bg-transparent hover:bg-transparent ${textColor}`}
          aria-hidden="true"
        />
      </Menu.Button>

      {/*Transition behavior */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/*Dropdown Items */}
        <Menu.Items className="flex absolute justify-center z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 ">
            {/*Considering */}
            <Menu.Item className="block px-4 py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#1E2F97] bg-light-blue bg-opacity-30 hover:bg-light-blue hover:bg-opacity-50 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('CONSIDERING');
                  }}
                >
                  CONSIDERING
                </button>
              )}
            </Menu.Item>
            {/*REVIEWING*/}
            <Menu.Item className="block px-4  py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#653D00] bg-[#fea31c] bg-opacity-20 hover:bg-[#fea31c] hover:bg-opacity-30 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('REVIEWING');
                  }}
                >
                  REVIEWING
                </button>
              )}
            </Menu.Item>

            {/*Accepted */}
            <Menu.Item className="block px-4 py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#29570D] bg-light-green bg-opacity-40 hover:bg-light-green hover:bg-opacity-60 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('ACCEPTED');
                  }}
                >
                  ACCEPTED
                </button>
              )}
            </Menu.Item>

            {/*Interviewing */}
            <Menu.Item className="block px-4 py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#2A0062] bg-[#6f32be] bg-opacity-20 hover:bg-[#6f32be] hover:bg-opacity-30 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('INTERVIEWING');
                  }}
                >
                  INTERVIEWING
                </button>
              )}
            </Menu.Item>

            {/*Not Accepted/Rejected*/}
            <Menu.Item className="block px-4 py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#570D0D] bg-[#E53939] bg-opacity-20 hover:bg-[#E53939] hover:bg-opacity-40 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('REJECTED');
                  }}
                >
                  REJECTED
                </button>
              )}
            </Menu.Item>

            {/*Joined */}
            <Menu.Item className="block px-4 py-2 text-sm" as="div">
              {() => (
                <button
                  className={`text-[#141466] bg-[#1E2F97] bg-opacity-20 hover:bg-[#1E2F97] hover:bg-opacity-30 ${buttonStyle}`}
                  onClick={() => {
                    updateTag('JOINED');
                  }}
                >
                  JOINED
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
