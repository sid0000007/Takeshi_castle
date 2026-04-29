import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-stone-100">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <Link className="text-amber-300 hover:text-amber-200" to="/">
          Back home
        </Link>
      </div>
    </div>
  );
}
