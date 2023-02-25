import { motion } from 'framer-motion';
import React, { Component } from 'react';


class LoadingAnimation extends Component {
    render () {
        return (
            <motion.span
                className='icon loading-animation'
                animate={{
                    top: [0, -30, 0, -50, 0]
                }}
                transition={{
                    duration: 2,
                    ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
                    repeat: Infinity
                }}
            >
                    <i className='fas fa-dog is-large' />
            </motion.span>
        );
    }
}

export default LoadingAnimation;
