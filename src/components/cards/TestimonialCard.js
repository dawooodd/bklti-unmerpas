/* eslint-disable @next/next/no-img-element */
export function TestimonialCard(props) {
  return (
    <div className="group bg-white dark:bg-base-950 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-2">
        <img
          src={props.avatar}
          alt={props.name}
          className="size-9 rounded-full ring-3 ring-primary-300 border-burple-500"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 leading-none">
            {props.name}
          </h2>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 leading-none">{props.title}</span>
        </div>
      </div>
      <p className="flex-grow text-base leading-relaxed text-slate-600 dark:text-slate-400 italic mt-4">{props.testimonial}</p>
    </div>
  );
}
