import firebase from '../../firebase'
import React from 'react';
import uuidv4 from 'uuid/v4';
import { Button, Input, Segment } from 'semantic-ui-react';
import FileModal from './FileModal'
import ProgressBar from "./ProgressBar";

class MessagesForm extends React.Component{
    state = {
        storageRef: firebase.storage().ref(),
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
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

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user : {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if(fileUrl !== null){
            message['image'] = fileUrl;
        }
        else{
            message['content'] = this.state.message;
        }
        console.log("Message in createMessage is: " + message)
        return message;
    };

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
        console.log("file and metadata");
        console.log(file, metadata);
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
        () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                console.log("percentUploaded is: " + percentUploaded);
                this.props.isProgressBarVisible(percentUploaded);
                this.setState({percentUploaded});
            },
            err => {
                console.log("Step into error 1");
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: 'error', 
                    uploadTask: null,
                })
            },
            () => {
                console.log("Step into Callback 2");
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                    this.sendFileMessage(downloadUrl, ref, pathToUpload);
                })
                .catch(err => {
                    console.log("Step into Catch Callback 2");
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error', 
                        uploadTask: null,
                    })
                })
            })
        })
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        console.log("Step into sendFileMessage");
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({uploadState: 'done'})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    }

    render(){
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
        return(
            <Segment className="messsage__form">
                <Input fluid name="message" onChange={this.handleChange} style={{marginBottom: '0.7em'}} label={<Button icon={"add"}/>} labelPosition="left" 
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                } placeholder="Write your message"
                value={message} />
                <Button.Group icon widths="2"  >
                    <Button color="orange" content="Add Reply" labelPosition="left" icon="edit" onClick={this.sendMessage} disabled={loading}/>
                    <Button color="teal" disabled={uploadState === "uploading"} content="Upload Media" labelPosition="right" icon="cloud upload" onClick={this.openModal}/>
                </Button.Group>
                <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile}/>
                <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />
            </Segment>
        );
    }
}

export default MessagesForm;