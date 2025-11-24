import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the title and buttons", () => {
    render(<Home />);

    expect(screen.getByText(/Deep Work Tracker/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
