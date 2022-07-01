import SignUpPage from "./SignUpPage.vue";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";

// it() refers to the component as opposed to jest()

it("has Sign Up Header", () => {
  // test code here
  render(SignUpPage);

  const header = screen.queryByRole("heading", { name: "Sign Up" });

  // assertion
  expect(header).toBeInTheDocument();
});
