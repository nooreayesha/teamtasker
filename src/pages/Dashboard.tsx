import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main>
        <section
          aria-labelledby="tasks-heading"
          className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600"
        >
          <h2 id="tasks-heading" className="text-lg font-semibold">
            No tasks yet
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Task management is coming in the next release.
          </p>
        </section>
      </main>
    </div>
  );
}
