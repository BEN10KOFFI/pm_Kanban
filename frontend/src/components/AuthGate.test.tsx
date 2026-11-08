import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthGate } from "@/components/AuthGate";
import { SESSION_AUTH_KEY } from "@/lib/auth";

describe("AuthGate", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows the login form without exposing the board", () => {
    render(<AuthGate />);

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    expect(screen.queryByTestId("column-col-backlog")).not.toBeInTheDocument();
  });

  it("rejects invalid credentials and opens the board for valid credentials", async () => {
    const user = userEvent.setup();
    render(<AuthGate />);

    await user.type(screen.getByLabelText("Username"), "wrong");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Incorrect username or password."
    );
    expect(screen.queryByTestId("column-col-backlog")).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("Username"));
    await user.type(screen.getByLabelText("Username"), "user");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByTestId("column-col-backlog")).toBeVisible();
    expect(sessionStorage.getItem(SESSION_AUTH_KEY)).toBe("true");
  });

  it("signs out and clears the session", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(SESSION_AUTH_KEY, "true");
    render(<AuthGate />);

    await user.click(await screen.findByRole("button", { name: "Sign out" }));

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    expect(sessionStorage.getItem(SESSION_AUTH_KEY)).toBeNull();
  });
});
