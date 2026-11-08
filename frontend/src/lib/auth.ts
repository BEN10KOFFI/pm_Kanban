export const SESSION_AUTH_KEY = "pm-authenticated";

const listeners = new Set<() => void>();

export const isValidCredentials = (username: string, password: string) =>
  username === "user" && password === "password";

export const subscribeToAuth = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getAuthSnapshot = () =>
  typeof window !== "undefined" &&
  sessionStorage.getItem(SESSION_AUTH_KEY) === "true";

export const getServerAuthSnapshot = () => false;

export const setSessionAuthenticated = () => {
  sessionStorage.setItem(SESSION_AUTH_KEY, "true");
  listeners.forEach((listener) => listener());
};

export const clearSessionAuthenticated = () => {
  sessionStorage.removeItem(SESSION_AUTH_KEY);
  listeners.forEach((listener) => listener());
};
