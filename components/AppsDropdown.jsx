import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

//TODO: When a job has already been applied to, remove "Mark as Applied" option
//Could change it so when a job is in Applied column, option changes to "Mark as Saved"
//TODO: Add a modal when removing that confirms the user wants to remove it

//Used for updating className when hovering over dropdown options
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

//Dropdown menu for applications on App Tracker

export default function AppsDropdown(props) {
  const { jobId } = props;

  //Note: Adding onClick handler outside render method makes it so clicking anywhere on the menu triggers the click
  //Results in immediately marking as applied or removing
  //But onClick works when embedded, so leaving it like that for now
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* The ... dropdown button */}
      <div>
        <Menu.Button className="inline-flex w-full justify-center  rounded-full bg-white px-1 py-1 gap-x-1.5 text-sm font-semibold text-gray-900 hover:bg-neutral-100">
          <EllipsisVerticalIcon className=" h-5 w-5 text-gray-500" aria-hidden="true" />
        </Menu.Button>
      </div>
      {/*Transition styling when menu is opened */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/*Dropdown content */}
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-neutral-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/*Apply*/}
            <Menu.Item className="flex flex-row">
              {({ active }) => (
                <a
                  //TODO: Link to apply page - links to job page for now
                  href={`/job/${jobId}`}
                  //Changes font color & bg color when hovering over dropdown options
                  className={classNames(
                    active ? 'bg-gray-100 bg text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <ArrowTopRightOnSquareIcon className=" w-6 px-1 " />
                  Apply
                </a>
              )}
            </Menu.Item>

            {/*Mark as Applied*/}
            <Menu.Item className="flex flex-row">
              {({ active }) => (
                <a
                  onClick={() => {
                    fetch(`/api/applications/${jobId}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        status: 'APPLIED',
                      }),
                    })
                      .then((response) => console.log(response))
                      //.then((data) => {})
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <CheckIcon className="w-6 px-1" />
                  Mark as Applied
                </a>
              )}
            </Menu.Item>

            {/*Remove*/}
            <Menu.Item className="flex flex-row">
              {({ active }) => (
                <a
                  onClick={() => {
                    fetch(`/api/applications/${jobId}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        status: 'HIDDEN',
                      }),
                    })
                      .then((response) => console.log(response))
                      //.then((data) => {})
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <TrashIcon className=" w-6 px-1" />
                  Remove
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
