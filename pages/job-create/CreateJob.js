import NavBar from '../nav/NavBar';
import { useState } from 'react';

export default function CreateJob() {
  const Department = [
    'ENGINEERING',
    'HUMANITIES',
    'LIFE_SCIENCES',
    'PHYSICAL_SCIENCES',
    'SOCIAL_SCIENCES',
  ];
  const Duration = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];
  const paidCreditOptions = ['Yes', 'No'];

  const [jobTitle, setjobTitle] = useState('');
  const [jobDescription, setjobDescription] = useState('');
  const [jobclosingDate, setclosingDate] = useState('');
  const [jobDuration, setjobDuration] = useState('');
  const [jobDepartments, setjobDepartments] = useState([]);
  const [jobPaid, setjobPaid] = useState(false);
  const [jobweeklyHours, setweeklyHours] = useState(0);
  const [jobcredit, setjobcredit] = useState(false);

  function handleChange() {
    fetch('/api/jobs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: jobTitle,
        description: jobDescription,
        closingDate: jobclosingDate,
        paid: jobPaid,
        duration: jobDuration,
        departments: jobDepartments,
        weeklyHours: jobweeklyHours,
        credit: jobcredit,
      }),
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
              id="closingdate"
              name="closingdate"
              required
            />
          </div>
          <div>
            <label for="duration">Duration</label>
            <select
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
            {/* Need to make this multiple options */}
            <label for="departments">Departments</label>
            <select
              value={jobDepartments}
              onChange={(e) => {
                setjobDepartments(e.target.value);
              }}
            >
              <option value="">--Select an option--</option>
              {Department.map((val, index) => (
                <option key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label for="paid">Paid</label>
            <select
              value={jobPaid}
              onChange={(e) => {
                if (e.target.value === 'Yes') setjobPaid(true);
                else setjobPaid(false);
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
            <label for="weeklyhours">Weekly Hours</label>
            <input
              value={jobweeklyHours}
              onChange={(e) => {
                setweeklyHours(e.target.value);
              }}
              type="number"
              id="weeklyhours"
              name="weeklyhours"
              required
              max="100"
            />
          </div>
          <div>
            <label for="credit">Credit</label>
            <select
              value={jobcredit}
              onChange={(e) => {
                if (e.target.value === 'Yes') setjobcredit(true);
                else setjobcredit(false);
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
              type="submit"
              onClick={() => {
                handleChange();
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
