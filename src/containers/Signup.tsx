import React, { useState } from "react";
import "./SignUp.css";
import { useInput } from "./Login";
import { Auth } from "aws-amplify";
import useReactRouter from "use-react-router";

interface IProps {
  props: {
    isAuthenticated: boolean;
    userHasAuthenticated: (authenticated: boolean) => void;
  };
}

const Signup: React.FC<IProps> = ({ props }) => {
  const [isLoading, setLoading] = useState(false);
  const email = useInput("");
  const password = useInput("");
  const confirmPassword = useInput("");
  const confirmationCode = useInput("");
  const [newUser, setNewUser] = useState();
  const { history } = useReactRouter();

  const validateForm = () => {
    return (
      email.value.length > 0 &&
      password.value.length > 0 &&
      password === confirmPassword
    );
  };

  const validateConfirmationForm = () => {
    return confirmationCode.value.length > 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: email.value,
        password: password.value
      });
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const handleConfirmationSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await Auth.confirmSignUp(email.value, confirmationCode.value);
      await Auth.signIn(email.value, password.value);
      props.userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  };

  const renderConfirmationForm = () => {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <div id="confirmationCode">
          <label>Confirmation Code</label>
          <input autoFocus type="tel" {...confirmationCode} />
          <div>Please check your email for the code.</div>
        </div>
        <button disabled={!validateConfirmationForm()} type="submit">
          signup
        </button>
      </form>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input autoFocus type="email" {...email} />
        </div>
        <div>
          <label>Password</label>
          <input {...password} type="password" />
        </div>
        <div>
          <label>Confirm Password</label>
          <input {...confirmPassword} type="password" />
        </div>
        <button disabled={validateForm()}>sign up</button>
      </form>
    );
  };

  return (
    <div className="Signup">
      {newUser === undefined ? renderForm() : renderConfirmationForm()}
    </div>
  );
};

export default Signup;
