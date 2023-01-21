export class AddNewItemModal extends React.Component {
    render () {
        if (!this.props.showModal) {
            return null;
        }

        return (
            <div className='modal is-active'>
                <div className='modal-background'></div>
                <div className='modal-content box'>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Amount' />
                            <span className='icon is-left'>
                                <i className='fas fa-sack-dollar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Date' />
                            <span className='icon is-left'>
                                <i className='far fa-calendar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Description' />
                            <span className='icon is-left'>
                                <i className='fas fa-comment' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Person' />
                            <span className='icon is-left'>
                                <i className='fas fa-user' />
                            </span>
                        </p>
                    </div>
                    <div className='buttons is-pulled-right'>
                        <button className='button is-success'>Add</button>
                        <button className='button' onClick={this.props.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
