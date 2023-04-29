import React from 'react';

function CheckBoxLists({ filterCategory, allCheckedBoxes, setallCheckedBoxes }) {
  const handleToggle = (value) => {
    console.log(value);
    const newChecked = new Set([...allCheckedBoxes]);
    if (!allCheckedBoxes.has(value)) {
      newChecked.add(value);
    } else {
      newChecked.delete(value);
    }
    setallCheckedBoxes(newChecked);
  };

  console.log(allCheckedBoxes);

  return filterCategory.map((value, index) => (
    <div class="bg-pink text-black" key={index}>
      <input
        onChange={() => handleToggle(value)}
        type="checkbox"
        checked={allCheckedBoxes.has(value)} /* unsure what to do with this */
      />
      <span class="font-serif m-3">{value}</span>
    </div>
  ));
}

export default CheckBoxLists;
