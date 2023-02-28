import React, { useState } from 'react';

function CheckBox({ checkedDepartments, setcheckedDepartments, Department }) {
  const handleToggle = (value) => {
    const newChecked = new Set([...checkedDepartments]);
    if (!checkedDepartments.has(value)) {
      newChecked.add(value);
    } else {
      newChecked.delete(value);
    }
    setcheckedDepartments(newChecked);
  };

  const renderCheckboxLists = () =>
    Department.map((value, index) => (
      <div class="bg-pink text-black" key={index}>
        <input
          onChange={() => handleToggle(value)}
          type="checkbox"
          checked={checkedDepartments.has(value)}
        />
        <span>{value}</span>
      </div>
    ));

  return <div>{renderCheckboxLists()}</div>;
}

export default CheckBox;
