export function LoginFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>&copy; 2025 PT SUCOFINDO (Persero). All rights reserved.</span>
        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
          <a className="text-blue-700 hover:underline dark:text-blue-300" href="mailto:helpdesk.aip@sucofindo.co.id">
            Helpdesk: helpdesk.aip@sucofindo.co.id
          </a>
          <span>Contact Us: +62 21 8067 5000</span>
          <a className="text-blue-700 hover:underline dark:text-blue-300" href="http://www.sucofindo.co.id">
            www.sucofindo.co.id
          </a>
        </div>
      </div>
    </footer>
  );
}
