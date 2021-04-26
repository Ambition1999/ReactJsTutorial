import firebase from '../../firebase'
import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';
import FileModal from './FileModal'

class MessagesForm extends React.Component{
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false
    }

    openModal = () => this.setState({modal: true});
    closeModal = () => this.setState({modal: false});

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user : {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        console.log("Message in createMessage is: " + message)
        return message;
    }

    sendMessage = () => { 
        const { messagesRef } = this.props;
        const { message, channel } = this.state;
        console.log("message is: " + message)
        if(message){
            this.setState({loading: true})
            messagesRef.child(channel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
                this.setState({loading: false, message: '', errors: []})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(err)
                })
            })
        }else{
            this.setState({
                errors: this.state.errors.concat({message: 'Add a messsage'})
            })
        }
    };

    uploadFile = (file, metadata) => {
        console.log(file, metadata);
    }

    render(){
        const { errors, message, loading, modal } = this.state;
        return(
            <Segment className="messsage__form">
                <Input fluid name="message" onChange={this.handleChange} style={{marginBottom: '0.7em'}} label={<Button icon={"add"}/>} labelPosition="left" 
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                } placeholder="Write your message"
                value={message} />
                <Button.Group icon widths="2"  >
                    <Button color="orange" content="Add Reply" labelPosition="left" icon="edit" onClick={this.sendMessage} disabled={loading}/>
                    <Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload" onClick={this.openModal}/>
                    <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile}/>
                </Button.Group>
            </Segment>
        );
    }
}

export default MessagesForm;