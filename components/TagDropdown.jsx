import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

//TODO:
//Need to use official colors, requires custom definitions via tailwind
// - Changing text color on click also
//Fix: Resizing behavior of tag buttons (buttons mess with padding and resize incorrectly when viewport is reduced)
//Fix: Dropdown overlap/scroll behavior
//Could change to a Listbox from HeadlessUI for readability
//OnClick should call to database to change status for that applicant to that tag

export default function TagDropdown() {
  const [color, setColor] = useState(
    'text-[#1E2F97] bg-light-blue bg-opacity-30 hover:bg-light-blue hover:bg-opacity-50'
  );
  const [tag, setTag] = useState('CONSIDERING');

  const buttonStyle =
    'inline-flex w-full justify-center gap-x-1.5 rounded-full px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-gray-300';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          //Changing button color based on the current selection
          className={` ${color} ${buttonStyle}`}
        >
          {tag}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>
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
        <Menu.Items className="fixed z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 ">
            {/*Considering */}
            <Menu.Item className="block px-4 py-2 text-sm">
              {({ active }) => (
                <a
                  onClick={() => {
                    //Setting color and title
                    setColor(
                      'text-[#1E2F97] bg-light-blue bg-opacity-30 hover:bg-light-blue hover:bg-opacity-50'
                    );
                    setTag('CONSIDERING');
                  }}
                >
                  <Menu.Button
                    className={`text-[#1E2F97] bg-light-blue bg-opacity-30 hover:bg-light-blue hover:bg-opacity-50 ${buttonStyle}`}
                  >
                    CONSIDERING
                  </Menu.Button>
                </a>
              )}
            </Menu.Item>

            {/*Accepted */}
            <Menu.Item className="block px-4 py-2 text-sm">
              {({ active }) => (
                <a
                  onClick={() => {
                    setColor(
                      'text-[#29570D] bg-light-green bg-opacity-40 hover:bg-light-green hover:bg-opacity-60'
                    );
                    setTag('ACCEPTED');
                  }}
                >
                  <Menu.Button
                    className={`text-[#29570D] bg-light-green bg-opacity-40 hover:bg-light-green hover:bg-opacity-60 ${buttonStyle}`}
                  >
                    ACCEPTED
                  </Menu.Button>
                </a>
              )}
            </Menu.Item>

            {/*Interviewing */}
            <Menu.Item className="block px-4 py-2 text-sm">
              {({ active }) => (
                <a
                  onClick={() => {
                    setColor(
                      'text-[#2A0062] bg-[#6f32be] bg-opacity-20 hover:bg-[#6f32be] hover:bg-opacity-30'
                    );
                    setTag('INTERVIEWING');
                  }}
                >
                  <Menu.Button
                    className={`text-[#2A0062] bg-[#6f32be] bg-opacity-20 hover:bg-[#6f32be] hover:bg-opacity-30 ${buttonStyle}`}
                  >
                    INTERVIEWING
                  </Menu.Button>
                </a>
              )}
            </Menu.Item>

            {/*Not Accepted*/}
            <Menu.Item className="block px-4 py-2 text-sm">
              {({ active }) => (
                <a
                  onClick={() => {
                    setColor(
                      'text-[#570D0D] bg-[#E53939] bg-opacity-20 hover:bg-[#E53939] hover:bg-opacity-40'
                    );
                    setTag('NOT ACCEPTED');
                  }}
                >
                  <Menu.Button
                    className={`text-[#570D0D] bg-[#E53939] bg-opacity-20 hover:bg-[#E53939] hover:bg-opacity-40 ${buttonStyle}`}
                  >
                    NOT ACCEPTED
                  </Menu.Button>
                </a>
              )}
            </Menu.Item>

            {/*Joined */}
            <Menu.Item className="block px-4 py-2 text-sm">
              {({ active }) => (
                <a
                  onClick={() => {
                    setColor(
                      'text-[#141466] bg-[#1E2F97] bg-opacity-20 hover:bg-[#1E2F97] hover:bg-opacity-30'
                    );
                    setTag('JOINED');
                  }}
                >
                  <Menu.Button
                    className={`text-[#141466] bg-[#1E2F97] bg-opacity-20 hover:bg-[#1E2F97] hover:bg-opacity-30 ${buttonStyle}`}
                  >
                    JOINED
                  </Menu.Button>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
