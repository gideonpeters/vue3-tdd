import SignUpPage from "./SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { rest } from "msw";
import { setupServer } from "msw/node";

// describe() allows us to group tests
describe("Sign Up Page", () => {
  describe("Layout", () => {
    // it() refers to the component as opposed to jest()
    it("has Sign Up Header", () => {
      // test code here
      render(SignUpPage);
      const header = screen.queryByRole("heading", { name: "Sign Up" });

      // assertion
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Username");
      //   const input = container.querySelector("input");

      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Email");

      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input).toBeInTheDocument();
    });

    it("has password type password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input.type).toBe("password");
    });

    it("has confirm password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Confirm Password");

      expect(input).toBeInTheDocument();
    });

    it("has password type password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Confirm Password");

      expect(input.type).toBe("password");
    });

    it("has Sign Up Button", () => {
      // test code here
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      // assertion
      expect(button).toBeInTheDocument();
    });

    it("disables Sign Up Button initially", () => {
      // test code here
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      // assertion
      // good practice to have a single assertion in each test
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let requestBody,
      button,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      usernameInput;
    let counter = 0;

    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeAll(() => server.listen());

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    afterAll(() => server.close());

    const setup = async () => {
      render(SignUpPage);

      usernameInput = screen.queryByLabelText("Username");
      emailInput = screen.queryByLabelText("Email");
      passwordInput = screen.queryByLabelText("Password");
      confirmPasswordInput = screen.queryByLabelText("Confirm Password");

      button = screen.queryByRole("button", { name: "Sign Up" });

      await userEvent.type(usernameInput, "gideonpeters");
      await userEvent.type(emailInput, "gideonpeters85@gmail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(confirmPasswordInput, "P4ssword");
    };

    const generateValidationErrors = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it("enables Sign Up Button when password and confirm password inputs have same values", async () => {
      await setup();

      expect(button).toBeEnabled();
    });

    it("sends username, email and password after clicking the Sign Up Button", async () => {
      await setup();

      await userEvent.click(button);
      await screen.findByText(
        "Please check your email to activate your account"
      );

      expect(requestBody).toEqual({
        username: "gideonpeters",
        email: "gideonpeters85@gmail.com",
        password: "P4ssword",
      });
    });

    it("does not allow clicking the sign up button when there is an ongoing api Call", async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);

      await screen.findByText(
        "Please check your email to activate your account"
      );

      expect(counter).toEqual(1);
    });

    // it("displays spinner while api request is in progress", async () => {
    //   await setup();

    //   await userEvent.click(button);

    //   //   const form = screen.queryByTestId("form-sign-up");
    //   const spinner = screen.queryByRole("status", { hidden: true });

    //   console.log(spinner);
    //   expect(spinner).toBeInTheDocument();
    // });

    it("does not display spinner when no api request is in progress", async () => {
      await setup();

      const spinner = screen.queryByRole("status", { hidden: true });

      expect(spinner).not.toBeInTheDocument();
    });

    it("displays account activation information after successful signup", async () => {
      await setup();

      await userEvent.click(button);

      const activationInfo = await screen.findByText(
        "Please check your email to activate your account"
      );

      expect(activationInfo).toBeVisible();
    });

    it("does not display account activation message before sign up request", async () => {
      await setup();

      const activationInfo = screen.queryByText(
        "Please check your email to activate your account"
      );

      expect(activationInfo).not.toBeInTheDocument();
    });

    it("does not display account activation message on failed sign up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      await setup();

      await userEvent.click(button);

      const activationInfo = screen.queryByText(
        "Please check your email to activate your account"
      );

      expect(activationInfo).not.toBeInTheDocument();
    });

    it("hides signup form after successful request", async () => {
      await setup();

      const form = screen.queryByTestId("form-sign-up");
      await userEvent.click(button);

      await screen.findByText(
        "Please check your email to activate your account"
      );
      await waitFor(() => {
        expect(form).not.toBeVisible();
      });
    });

    it("hides spinner after error response received", async () => {
      server.use(
        generateValidationErrors("username", "username cannot be null")
      );

      await setup();

      await userEvent.click(button);

      await screen.findByText("username cannot be null");

      const spinner = screen.queryByRole("status", { hidden: true });

      expect(spinner).not.toBeInTheDocument();
    });

    it("enables sign up button after error response received", async () => {
      server.use(
        generateValidationErrors("username", "username cannot be null")
      );

      await setup();

      await userEvent.click(button);

      await screen.findByText("username cannot be null");

      expect(button).toBeEnabled();
    });

    it.each`
      field         | message
      ${"username"} | ${"username cannot be null"}
      ${"email"}    | ${"email cannot be null"}
    `("displays $message for field $field", async ({ field, message }) => {
      server.use(generateValidationErrors(field, message));

      await setup();

      await userEvent.click(button);

      const text = await screen.findByText(message);

      expect(text).toBeInTheDocument();
    });

    it("displays mismatch for password repeat input", async () => {
      await setup();

      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(confirmPasswordInput, "P4sswor");

      const text = await screen.findByText("password mismatch");

      expect(text).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"username cannot be null"} | ${"Username"}
      ${"email"}    | ${"email cannot be null"}    | ${"Email"}
      ${"password"} | ${"password cannot be null"} | ${"Password"}
    `(
      "clears validation errors after $field field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationErrors(field, message));

        await setup();

        await userEvent.click(button);

        const input = screen.queryByLabelText(label);
        const text = await screen.findByText(message);
        await userEvent.type(input, "updated");

        expect(text).not.toBeInTheDocument();
      }
    );
  });
});
