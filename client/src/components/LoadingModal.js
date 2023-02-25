import { motion } from 'framer-motion';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoadingAnimation from './LoadingAnimation';
import Modal from './Modal';


class LoadingModal extends Component {
    render () {
        return (
            <Modal showModal={this.props.showModal} className='loading-modal'>
                <LoadingAnimation />
            </Modal>
        )
    }
}

export default connect(
    (state) => ({
        showModal: state.expenses.status == 'loading' || state.persons.status == 'loading' || state.calculation.status == 'loading'
    })
)(LoadingModal);
