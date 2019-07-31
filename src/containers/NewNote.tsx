import React, { useState } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import config from "../config";
import "./NewNote.css";
import { useInput } from "./Login";

const NewNote: React.FC = () => {
  const [file, setFile] = useState();
  const [isLoading, setLoading] = useState();
  const content = useInput();

  const validateForm = () => {
    return content.value.length > 0;
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    console.log(file);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setLoading(true);
  };

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <input {...content} />
        </FormGroup>
        <FormGroup controlId="file">
          <label>Attachment</label>
          <input onChange={handleFileChange} type="file" />
        </FormGroup>
        <button disabled={!validateForm()}>create</button>
      </form>
    </div>
  );
};

export default NewNote;
