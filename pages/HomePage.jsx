import JobsPage from './search-components/JobsPage';
import NavBar from './nav/NavBar';

function HomePage({ jobs }) {
  return (
    <div>
      <div class="font-serif text-center text-5xl m-4">Bresearch</div>
      <NavBar></NavBar>
      <JobsPage jobs={jobs} />
    </div>
  );
}

export default HomePage;
