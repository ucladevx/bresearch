import React, { useState } from 'react';
import CheckBoxLists from './CheckBoxLists';

function CheckBox({ allCheckedBoxes, setallCheckedBoxes, Department, Duration }) {
  // const renderCheckboxLists = () =>
  //   Department.map((value, index) => (
  //     <div class="bg-pink text-black" key={index}>
  //       <input
  //         onChange={() => handleToggle(value)}
  //         type="checkbox"
  //         checked={checkedDepartments.has(value)}
  //       />
  //       <span class="font-serif m-3">{value}</span>
  //     </div>
  //   ));

  // Update this when clicking "Department"
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <div>
        <div onClick={() => setIsVisible(!isVisible)} class="text-black font-serif">
          DEPARTMENT
        </div>
        {isVisible ? (
          <CheckBoxLists
            filterCategory={Department}
            allCheckedBoxes={allCheckedBoxes}
            setallCheckedBoxes={setallCheckedBoxes}
          />
        ) : null}
      </div>
      <div>
        <div class="text-black font-serif">DURATION</div>
        <CheckBoxLists
          filterCategory={Duration}
          allCheckedBoxes={allCheckedBoxes}
          setallCheckedBoxes={setallCheckedBoxes}
        />
      </div>
    </div>
  );
}

export default CheckBox;
