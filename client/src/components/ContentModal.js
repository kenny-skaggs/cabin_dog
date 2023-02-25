import { AnimatePresence, motion} from 'framer-motion';
import React, {Component} from 'react';

import Modal from './Modal';


export default class ContentModal extends Component {
    render () {
        return (
            <Modal showModal={this.props.showModal}>
                <motion.div
                    className='modal-content box'
                    initial={{scale: 0.8}} animate={{scale: 1}} exit={{scale: 0.8}}
                >
                    {this.props.children}
                </motion.div>
            </Modal>
        )
    }
}