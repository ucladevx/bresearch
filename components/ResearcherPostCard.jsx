import Link from 'next/link';

export default function ResearcherPostCard({ id, labName, title, closingDate }) {
  return (
    <div className="bg-white rounded-[1.25rem] p-12 max-w-[68.5rem] flex flex-col">
      <div className="flex justify-between text-[#404040] text-base gap-x-8">
        <div className="font-medium">{labName}</div>
        <div>
          <span className="font-medium">{0}</span>
          <span className="font-normal"> Applicants</span>
        </div>
      </div>
      <div className="mt-[1.125rem] font-semibold text-2xl">{title}</div>
      <div className="mt-[3.75rem] flex justify-between flex-wrap">
        <div className="text-base font-normal text-[#404040] min-w-fit">
          {new Date(closingDate).getTime() > Date.now() ? (
            <>
              Applications open until{' '}
              <span className="font-medium text-dark-blue">
                {new Intl.DateTimeFormat('en-US', {
                  // year: 'numeric',
                  // month: 'short',
                  // day: 'numeric',
                  // hour: 'numeric',
                  // minute: '2-digit',
                  // timeZoneName: 'longGeneric',
                })
                  .format(new Date(closingDate))
                  .replace(',', '')}
              </span>
            </>
          ) : (
            <>
              Applications closed on{' '}
              <span className="font-medium text-dark-blue">
                {new Intl.DateTimeFormat('en-US').format(new Date(closingDate)).replace(',', '')}
              </span>
            </>
          )}
        </div>
        <div className="font-semibold flex gap-x-4">
          <Link
            href={`/job/${id}/edit`}
            className="px-6 py-4 border-[1px] border-dark-blue rounded-xl text-dark-blue inline-block invisible"
          >
            Edit Post
          </Link>
        </div>
      </div>
    </div>
  );
}
