import React, { Component } from 'react';
import ContentModal from '../../components/ContentModal';


export default class extends Component {
    render () {
        return (
            <ContentModal showModal={true}>
                <h1 className='title'>Hi!</h1>
                <p>
                    Welcome to Cabin Dog. If you're the first user in the household then follow
                    the steps below. Otherwise use another device that is already set up to get
                    a code to activate this one, or ask a user in the household you would like
                    to join to create a link for you to activate.
                </p>
                <br></br>
                <p>
                    <em>todo: steps to activate new user</em>
                </p>
            </ContentModal>
        );
    }
}
