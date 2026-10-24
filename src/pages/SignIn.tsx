import { useId, useState, type FormEvent } from "react";
import { MAX_NAME_LENGTH, useAuth } from "../contexts/AuthContext";

export default function SignIn() {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signIn(name)) {
      setError("Please enter your name to continue.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <div>
          <h1 className="text-xl font-bold">TeamTasker</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to continue</p>
        </div>

        <div>
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
            Your name
          </label>
          <input
            id={inputId}
            type="text"
            autoComplete="name"
            maxLength={MAX_NAME_LENGTH}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          />
          {error && (
            <p id={errorId} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
