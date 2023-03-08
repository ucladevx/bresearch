import JobsPage from './SearchComponents/JobsPage';

function HomePage({ jobs }) {
  return (
    <div>
      <div class="font-serif text-center text-5xl m-4">Bresearch</div>
      <JobsPage jobs={jobs} />
    </div>
  );
}

export default HomePage;
