import { AnimatePresence, motion} from 'framer-motion';
import React, {Component} from 'react';

export default class Modal extends Component {
    render () {
        const modal = (
            <motion.div
                initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                transition={{duration: 0.1}}
                className={`modal is-active ${this.props.className }`}
            >
                <div className='modal-background'></div>
                {this.props.children}
            </motion.div>
        );
        return (
            <AnimatePresence>
                {this.props.showModal ? modal : ''}
            </AnimatePresence>
        )
    }
}