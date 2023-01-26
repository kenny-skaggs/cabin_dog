import {motion} from 'framer-motion';
import React, {Component} from 'react';

export default class Button extends Component {
    render () {
        return (
            <motion.button 
                {...this.props}
                whileTap={{scale: 0.9}} transition={{duration: 0.01}}
                className={['button', this.props.className].join(' ')}
            />
        )
    }
}
