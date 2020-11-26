import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import  ApiConext from '../ApiContext';
import config from '../config';
import './App.css';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import RenderError from '../RenderError';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };
    
      addFolder = newFolder => {
        this.setState({
          notes: [ ...this.state.folders, newFolder ],
        })
    }
    componentDidMount(){
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
        .then(([notesRes, foldersRes]) => {
            if(!notesRes.ok)
            return notesRes.json().then(e => Promise.reject(e));
            if(!foldersRes.ok)
            return foldersRes.json().then(e => Promise.reject(e));

            return Promise.all([notesRes.json(), foldersRes.json()]);
        })

        .then(([notes, folders]) => {
            this.setState({notes, folders});
        })

        .catch(error =>{
            console.error({error});
        });

    
    }
  


    handleDeleteNote = noteId => {
        const newNotes = this.state.notes.filter(note =>
            note.id !== noteId)
            this.setState({
                notes: newNotes
            })
    }
    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                           component={NoteListNav}/>
                ))}
                <Route path="/note/:noteId" component={NotePageNav}/>
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain}/>
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote}/>
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote
        };
        console.log(value);
        return (
            <ApiConext.Provider value={value}>
            <div className="App">
                <RenderError>
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                </RenderError>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
            <RenderError>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </RenderError>
            </div>
            </ApiConext.Provider>
        );
    }
}

export default App;
