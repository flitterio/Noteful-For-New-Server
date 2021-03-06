import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';
import './AddNote.css';

class AddNote extends Component{
    static contextType = ApiContext;
    state = {
        error: null,
    }

    handleSubmit=(event) => {
        event.preventDefault()
        const {name, content, selectFolder} = event.target
        const newNote = {
            folder_id: selectFolder.value,
            note_name: name.value,
            content: content.value,
            date_updated: new Date(),
            id: '_' + Math.random().toString(36).substr(2, 9)
        }
        newNote.propTypes={
            folder_id: PropTypes.string.isRequired,
            note_name: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        };

        
        this.setState({ error: null})
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json',
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }
            window.location.href='/';
        }) 
        .catch(error => {
            this.setState({error})
        })


    };

        render() {
            const {folders=[]} = this.context
            return (
            <form className='addNote' onSubmit={this.handleSubmit.bind(this)}>
                    <h2>Create a New Note </h2>
                <div className='noteForm'>
                    <div className='form-group'>
                        <label htmlFor='name'>
                            Enter Note Name:
                            {' '}
                            </label>
                        <input type='text' 
                        className='addNote' name='name' id='name' required/>
                    </div>
                <div className='form-group'>
                    <label htmlFor='content'>
                        Enter Note Content:
                    
                        </label>
                    <textarea name='content' id='content' required/>
                </div>
                <div className='addNote'>
                    <label htmlFor='selectFolder'>Select a Folder</label>
                    <select name='selectFolder' id='selectFolder' required>
                        <option key='default' defaultValue value='' >Select...</option>
                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}> {folder.folder_name}</option>
                    ))}  
                    
                    </select>
                </div>
                    <button type='submit' className='noteForm'>
                        Save
                    </button>
                </div>
            </form>

            );
        }
    }

    export default AddNote;
