import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

//TODO:
//Need to use official colors, requires custom definitions via tailwind
// - Changing text color on click also
//Fix: Resizing behavior of tag buttons (buttons mess with padding and resize incorrectly when viewport is reduced)
//Fix: Dropdown overlap/scroll behavior
//Refactor via mapping? to condense code
//OnClick should call to database to change status for that applicant to that tag

export default function TagDropdown() {
  const [color, setColor] = useState('bg-sky-100 hover:bg-sky-200');
  const [tag, setTag] = useState('CONSIDERING');

  const buttonStyle =
    'inline-flex w-full justify-center gap-x-1.5 rounded-full px-3 py-1 text-sm font-semibold text-gray-900 shadow-md ring-gray-300';

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
                    setColor('bg-sky-100 hover:bg-sky-200');
                    setTag('CONSIDERING');
                  }}
                >
                  <Menu.Button className={`bg-sky-100 hover:bg-sky-200 ${buttonStyle}`}>
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
                    setColor('bg-lime-100 hover:bg-lime-200');
                    setTag('ACCEPTED');
                  }}
                >
                  <Menu.Button className={`bg-lime-100 hover:bg-lime-200 ${buttonStyle}`}>
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
                    setColor('bg-violet-200 hover:bg-violet-300');
                    setTag('INTERVIEWING');
                  }}
                >
                  <Menu.Button className={`bg-violet-200 hover:bg-violet-300 ${buttonStyle}`}>
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
                    setColor('bg-red-200 hover:bg-red-300');
                    setTag('NOT ACCEPTED');
                  }}
                >
                  <Menu.Button className={`bg-red-200 hover:bg-red-300 ${buttonStyle}`}>
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
                    setColor('bg-indigo-200 hover:bg-indigo-300');
                    setTag('JOINED');
                  }}
                >
                  <Menu.Button className={`bg-indigo-200 hover:bg-indigo-300 ${buttonStyle}`}>
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
