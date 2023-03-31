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

  return (
    <div>
      <div>
        <div class="text-black font-serif">DEPARTMENT</div>
        <CheckBoxLists
          filterCategory={Department}
          allCheckedBoxes={allCheckedBoxes}
          setallCheckedBoxes={setallCheckedBoxes}
        />
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
