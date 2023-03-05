import React, { Component } from 'react';
import Button from '../../components/Button';
import ContentModal from '../../components/ContentModal';


export default class extends Component {
    render () {
        let message = '';
        if (this.props.deviceToken) {
            message = <p>Open link {`${window.location.origin}#${this.props.deviceToken}`} on new device.</p>
        } else if (this.props.personToken) {
            message = <p>Have them open {`${window.location.origin}#${this.props.personToken}`} on their device.</p>
        }

        return (
            <ContentModal showModal={true}>
                {message}
                <Button onClick={() => this.props.onDone()}>
                    Done!
                </Button>
            </ContentModal>
        );
    }
}
