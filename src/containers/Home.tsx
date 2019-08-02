import React, { useState, useEffect } from "react";
import "./Home.css";
import { API } from "aws-amplify";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface IProps {
  isAuthenticated: boolean;
  userHasAuthenticated?: (authenticated: boolean) => void;
}

const Home: React.FC<IProps> = ({ isAuthenticated }) => {
  const [isLoading, setLoading] = useState();
  const [notes, setNotes] = useState([]);

  const init = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const getNotes = async () => {
    return await API.get("notes", "/notes", init);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const notes: any = getNotes();
      notes.then((notes: any) => setNotes(notes));
    } catch (e) {
      alert(e);
    }

    setLoading(false);
  }, []);
  const renderLander = () => {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <div className="notes">
        <h1>Your Notes</h1>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  };
  const renderNotesList = (notes: any) => {
    return [{}].concat(notes).map((note: any, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <div>
            <h1>{note.content.trim().split("\n")[0]}</h1>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </div>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  };

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
};

export default Home;
