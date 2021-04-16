import React from 'react';
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import { Segment, Comment } from 'semantic-ui-react';

class Messages extends React.Component {
    render () {
        return (
            <React.Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className="messages">{/* Messages */}</Comment.Group>
                </Segment>
                <MessagesForm />
            </React.Fragment>
        )
    }
}

export default Messages;