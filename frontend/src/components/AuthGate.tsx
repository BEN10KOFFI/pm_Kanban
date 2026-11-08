"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import {
  clearSessionAuthenticated,
  getAuthSnapshot,
  getServerAuthSnapshot,
  isValidCredentials,
  setSessionAuthenticated,
  subscribeToAuth,
} from "@/lib/auth";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidCredentials(username, password)) {
      setError("Incorrect username or password.");
      return;
    }

    setSessionAuthenticated();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--surface)] px-6 py-12">
      <section className="w-full max-w-md rounded-[32px] border border-[var(--stroke)] bg-white p-8 shadow-[var(--shadow)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gray-text)]">
          Kanban Studio
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--navy-dark)]">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--gray-text)]">
          Sign in to open your project board.
        </p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--navy-dark)]">
            Username
            <input
              autoComplete="username"
              className="rounded-xl border border-[var(--stroke)] bg-[var(--surface)] px-4 py-3 font-normal outline-none transition focus:border-[var(--primary-blue)]"
              name="username"
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              required
              value={username}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--navy-dark)]">
            Password
            <input
              autoComplete="current-password"
              className="rounded-xl border border-[var(--stroke)] bg-[var(--surface)] px-4 py-3 font-normal outline-none transition focus:border-[var(--primary-blue)]"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            className="rounded-xl bg-[var(--secondary-purple)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-blue)]"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
};

export const AuthGate = () => {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const handleLogout = () => {
    clearSessionAuthenticated();
  };

  return isAuthenticated ? (
    <KanbanBoard onLogout={handleLogout} />
  ) : (
    <LoginScreen />
  );
};
