import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

const NAME_LABEL = "Your name";

async function signInAs(name: string) {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.type(screen.getByLabelText(NAME_LABEL), `${name}{Enter}`);
  return { user, view };
}

describe("sign in", () => {
  it("shows the sign-in form first", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "TeamTasker" })).toBeInTheDocument();
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
  });

  it("rejects an empty name and explains why", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your name");
    expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
  });

  it("rejects a whitespace-only name", async () => {
    await signInAs("   ");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
  });

  it("submits with the Enter key and greets the user", async () => {
    await signInAs("Ayesha");
    expect(screen.getByRole("heading", { name: "Welcome, Ayesha" })).toBeInTheDocument();
  });

  it("trims surrounding spaces from the name", async () => {
    await signInAs("  Ayesha  ");
    expect(screen.getByRole("heading", { name: "Welcome, Ayesha" })).toBeInTheDocument();
  });

  it("clears the error message once the user starts typing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await user.type(screen.getByLabelText(NAME_LABEL), "A");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("session", () => {
  it("returns to the sign-in form after signing out", async () => {
    const { user } = await signInAs("Ayesha");
    await user.click(screen.getByRole("button", { name: "Sign Out" }));
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
  });

  it("restores the session after a reload", async () => {
    const { view } = await signInAs("Ayesha");
    view.unmount();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Welcome, Ayesha" })).toBeInTheDocument();
  });

  it("ignores corrupted stored session data", () => {
    window.localStorage.setItem("teamtasker:user", "{not valid json");
    render(<App />);
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
  });
});

describe("theme", () => {
  it("toggles dark mode on the <html> element and updates the button label", async () => {
    const { user } = await signInAs("Ayesha");
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("remembers the choice in localStorage", async () => {
    const { user } = await signInAs("Ayesha");
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(window.localStorage.getItem("teamtasker:theme")).toBe("dark");
  });

  it("keeps the theme applied on the sign-in screen after signing out", async () => {
    const { user } = await signInAs("Ayesha");
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    await user.click(screen.getByRole("button", { name: "Sign Out" }));
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("starts in the saved theme", () => {
    window.localStorage.setItem("teamtasker:theme", "dark");
    render(<App />);
    expect(document.documentElement).toHaveClass("dark");
  });
});
