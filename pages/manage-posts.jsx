import { useState, useEffect } from 'react';
import ResearcherSidebar from '../components/ResearcherSidebar';
import ResearcherPostCard from '../components/ResearcherPostCard';

import Head from 'next/head';
import Link from 'next/link';

function ResearcherPosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function getPosts() {
      try {
        const posts = await (await fetch('/api/researcher/posts')).json();
        // console.log({ posts });
        setPosts(posts);
      } catch (e) {}
    }
    getPosts();
  }, []);
  return (
    <>
      <Head>
        <title>Manage Posts</title>
      </Head>
      <ResearcherSidebar />
      <main className="min-h-screen ml-[15.5rem] flex flex-col bg-light-gray pl-10 gap-y-11">
        <div
          className="flex justify-end min-w-fit max-w-[68.5rem]"
          // max-width = ResearcherPostCard width
        >
          <Link
            href="/job/create"
            className="flex mt-[3.75rem] items-center justify-center w-[12.25rem] h-14 rounded-lg border-dark-blue border-[1px]"
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.5 12H18.5H6.5ZM12.5 18V6V18Z" fill="#141466" />
              <path
                d="M6.5 12H18.5M12.5 18V6"
                stroke="#141466"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="ml-2 font-medium text-lg">New Post</span>
          </Link>
        </div>
        {posts !== null && (
          <div className="flex flex-col gap-3 mb-3">
            {posts.length === 0 ? (
              <div>You have no posts.</div>
            ) : (
              posts.map(
                ({
                  id,
                  lab: { name: labName },
                  title,
                  closingDate,
                  _count: { applicants: applicantCount },
                }) => (
                  <ResearcherPostCard
                    key={id}
                    id={id}
                    labName={labName}
                    title={title}
                    closingDate={closingDate}
                    applicantCount={applicantCount}
                  />
                )
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default ResearcherPosts;
