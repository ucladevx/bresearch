import NavBar from '../nav/NavBar';
import { useState } from 'react';
import Select from 'react-select';

export default function CreateJob() {
  const Department = [
    { value: 'ENGINEERING', label: 'Engineering' },
    { value: 'HUMANITIES', label: 'Humanities' },
    { value: 'LIFE_SCIENCES', label: 'Life Sciences' },
    { value: 'PHYSICAL_SCIENCES', label: 'Physical Sciences' },
    { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
  ];
  const Duration = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];
  const paidCreditOptions = ['Yes', 'No'];
  const Location = ['ON_CAMPUS', 'OFF_CAMPUS', 'REMOTE'];

  const [jobTitle, setjobTitle] = useState('');
  const [jobDescription, setjobDescription] = useState('');
  const [jobclosingDate, setclosingDate] = useState('');
  const [jobDuration, setjobDuration] = useState('');
  const [jobDepartments, setjobDepartments] = useState([]);
  const [jobPaid, setjobPaid] = useState(false);
  const [jobweeklyHours, setweeklyHours] = useState(0);
  const [jobcredit, setjobcredit] = useState(false);
  const [jobLocation, setjobLocation] = useState('');

  function handleChange(e) {
    e.preventDefault();
    const date_obj = new Date(jobclosingDate);
    const date_iso = date_obj.toISOString();
    const job_paid_bool = jobPaid === 'Yes';
    const job_credit_bool = jobcredit === 'Yes';
    const newJob = {
      title: jobTitle,
      description: jobDescription,
      closingDate: date_iso,
      paid: job_paid_bool,
      duration: jobDuration,
      departments: jobDepartments,
      weeklyHours: jobweeklyHours,
      credit: job_credit_bool,
      location: jobLocation,
    };
    console.log('new job', newJob);
    fetch('/api/jobs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });
  }
  return (
    <div>
      <NavBar></NavBar>
      <li>Create Job Form:</li>
      <div class="p-4 m-4x">
        <form action="/api/jobs/create" method="post">
          <div>
            <label for="title">Title</label>
            <input
              value={jobTitle}
              onChange={(e) => {
                setjobTitle(e.target.value);
              }}
              type="text"
              id="title"
              name="title"
              required
              minlength="5"
            />
          </div>
          <div>
            <label for="description">Description</label>
            <input
              value={jobDescription}
              onChange={(e) => {
                setjobDescription(e.target.value);
              }}
              type="text"
              id="description"
              name="description"
              required
            />
          </div>
          <div>
            <label for="closingdate">Closing Date</label>
            <input
              value={jobclosingDate}
              onChange={(e) => {
                setclosingDate(e.target.value);
              }}
              type="date"
              id="closingDate"
              name="closingDate"
            />
          </div>
          <div>
            <label for="duration">Duration</label>
            <select
              required
              value={jobDuration}
              onChange={(e) => {
                setjobDuration(e.target.value);
              }}
            >
              <option value="">--Select an option--</option>
              {Duration.map((val, index) => (
                <option key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label for="departments">Departments</label>
            {/* <select
              multiple
              value={jobDepartments}
              onChange={(e) => {
                const newSelectedOptions = [];
                const optionsLength = e.target.options.length;
                for (let i = 0; i < optionsLength; i++) {
                  if (e.target.options[i].selected) {
                    newSelectedOptions.push(e.target.options[i].value);
                  }
                }
                console.log('selected:', e);
                console.log('selected value', newSelectedOptions);
                setjobDepartments(newSelectedOptions);
              }}
            >
              <option value="">--Select an option--</option>
              {Department.map((dept) => (
                <option key={dept.index} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select> */}
            <Select
              isMulti
              name="department"
              options={Department}
              onChange={(selected) => {
                const newSelectedOptions = [];
                const selectedLength = selected.length;
                for (let i = 0; i < selectedLength; i++) {
                  newSelectedOptions.push(selected[i].value);
                }
                setjobDepartments(newSelectedOptions);
              }}
            />
          </div>
          <div>
            <label for="location">Location</label>
            <select
              required
              value={jobLocation}
              onChange={(e) => {
                setjobLocation(e.target.value);
              }}
            >
              <option value="">--Select an option--</option>
              {Location.map((val, index) => (
                <option key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label for="paid">Paid</label>
            <select
              required
              value={jobPaid}
              onChange={(e) => {
                console.log('e', e.target.value);
                e.target.value;
              }}
            >
              <option value="">--Select an option--</option>
              {paidCreditOptions.map((val, index) => (
                <option key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label for="weeklyHours">Weekly Hours</label>
            <input
              value={jobweeklyHours}
              onChange={(e) => {
                setweeklyHours(e.target.value);
              }}
              type="number"
              id="weeklyHours"
              name="weeklyHours"
              required
              max="100"
            />
          </div>
          <div>
            <label for="credit">Credit</label>
            <select
              required
              value={jobcredit}
              onChange={(e) => {
                setjobcredit(e.target.value);
              }}
            >
              <option value="">--Select an option--</option>
              {paidCreditOptions.map((val, index) => (
                <option key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              // type="submit"
              onClick={handleChange}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
