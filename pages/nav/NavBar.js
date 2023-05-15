import Link from 'next/link';

export default function NavBar() {
  return (
    <div>
      <Link href="/">
        <button class="p-4 m-4 bg-teal-600 rounded">Home</button>
      </Link>
      <Link href="/job-create/CreateJob">
        <button class="p-4 m-4 bg-teal-600 rounded">Create Job</button>
      </Link>
    </div>
  );
}
