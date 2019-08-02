import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import useReactRouter from "use-react-router";
import config from "../config";
import { FormGroup } from "react-bootstrap";
import { s3Upload } from "../libs/awsLib";

const Notes: React.FC = () => {
  const {
    history,
    match: { params }
  } = useReactRouter();
  const [file, setFile] = useState();
  const [note, setNote] = useState();
  const [attachmentURL, setAttachment] = useState<any>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const getUrl = async (attachment: any) => {
    return await Storage.vault.get(attachment);
  };

  useEffect(() => {
    try {
      const note = getNote();
      note.then((note) => {
        const { content, attachment } = note;
        let attachmentURL;
        if (attachment) {
          attachmentURL = getUrl(attachment);
          attachmentURL!.then((url) => {
            setNote(note);
            setContent(content);
            setAttachment(url);
          });
        }
      });
    } catch (e) {
      alert(e);
    }
  }, []);

  const getNote = () => {
    const init = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return API.get("notes", `/notes/${params.id}`, init);
  };
  const validateForm = () => {
    return content.length > 0;
  };

  const formatFilename = (str: string) => {
    return str.replace(/^\w+-/, "");
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setContent(event.target.value);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFile(event.target.files![0]);
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
      if (file) {
        const attachment = await s3Upload(file);
        await saveNote({
          content: content,
          attachment: attachment || note.attachment
        });
        history.push("/");
      }
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      alert(e);
      setDeleting(false);
    }
  };

  const saveNote = (note: any) => {
    return API.put("notes", `/notes/${params.id}`, {
      body: note
    });
  };

  const deleteNote = () => {
    const init = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return API.del("notes", `/notes/${params.id}`, init);
  };

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <textarea
              className="Content"
              onChange={handleChange}
              value={content}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <label>Attachment</label>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </div>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <label>Attachment</label>}
            <input onChange={handleFileChange} type="file" />
          </FormGroup>
          <button className="Button" disabled={!validateForm()}>
            save
          </button>
          <button className="Button" onClick={handleDelete}>
            delete
          </button>
        </form>
      )}
    </div>
  );
};

export default Notes;
