import React, { useState } from "react";
import { FormGroup } from "react-bootstrap";
import config from "../config";
import "./NewNote.css";
import { useInput } from "./Login";
import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";
import useReactRouter from "use-react-router";
const NewNote: React.FC = () => {
  const [file, setFile] = useState();
  const [isLoading, setLoading] = useState();
  const content = useInput();

  const { history } = useReactRouter();

  const validateForm = () => {
    return content.value.length > 0;
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    setFile(file);
  };

  const createNote = async (note: any) => {
    return await API.post("notes", "/notes", {
      body: note
    });
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

    try {
      const attachment = file ? await s3Upload(file) : null;
      await createNote({
        attachment,
        content: content.value
      });
      history.push("/");
    } catch (e) {
      alert(e);
      setLoading(false);
    }
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
