import VInput from "./VInput.vue";
import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";

it("has is-invalid class for input when help is set", () => {
  const { container } = render(VInput, {
    props: {
      label: "Username",
      id: "username",
      help: "username is invalid",
    },
  });

  const input = container.querySelector("input");

  expect(input.classList).toContain("is-invalid");
});

it("does not have is-invalid class for input when help is not set", () => {
  const { container } = render(VInput, {
    props: {
      label: "Username",
      id: "username",
      help: "",
    },
  });

  const input = container.querySelector("input");

  expect(input.classList).not.toContain("is-invalid");
});

it("has invalid-feedback class for span when help is set", () => {
  const { container } = render(VInput, {
    props: {
      label: "Username",
      id: "username",
      help: "username is invalid",
    },
  });

  const span = container.querySelector("span");

  expect(span.classList).toContain("invalid-feedback");
});
