import Link from 'next/link';

export default function NavBar() {
  return (
    <div>
      <div class="font-serif text-center text-5xl m-4">Bresearch</div>
      <Link href="/">
        <button class="p-4 m-4 bg-teal-600 rounded">Home</button>
      </Link>
      <Link href="/JobCreationForm/CreateJob">
        <button class="p-4 m-4 bg-teal-600 rounded">Create Job</button>
      </Link>
    </div>
  );
}
