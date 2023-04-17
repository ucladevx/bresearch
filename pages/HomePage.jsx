import JobsPage from './SearchComponents/JobsPage';
import NavBar from './nav/NavBar';

function HomePage({ jobs }) {
  return (
    <div>
      <NavBar></NavBar>
      <JobsPage jobs={jobs} />
    </div>
  );
}

export default HomePage;
