import React, {Component} from "react";

export default class CurrencyDisplay extends Component {
    render = () => (
        <span>{
            parseFloat(
                this.props.amount
            ).toLocaleString(
                'en-US', 
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        }</span>
    )
}
