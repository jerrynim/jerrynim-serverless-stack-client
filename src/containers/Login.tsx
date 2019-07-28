import React, { useState, useCallback } from "react";
import { Button, FormGroup } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";

const Login: React.FC = () => {
  const useInput = (defaultValue: string = "") => {
    const [value, setValue] = useState(defaultValue);
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    }, []);
    return { value, onChange };
  };

  const email = useInput("");
  const password = useInput("");

  const validateForm = () => {
    return email.value.length > 0 && password.value.length > 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    try {
      await Auth.signIn(email.value, password.value);
      alert("Logged in");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>email</label>
          <input type="email" {...email} />
        </FormGroup>
        <FormGroup>
          <label>password</label>
          <input {...password} type="password" />
        </FormGroup>
        <Button disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
