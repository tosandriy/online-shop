import React from 'react';

import minus from '../images/minus.png';
import plus from '../images/plus.png';

class AmountSelectButton extends React.Component {

    constructor(props) {
        super(props);
        this.onMinusClick = this.onMinusClick.bind(this);
        this.onPlusClick = this.onPlusClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onMinusClick = () => {
        if (!(this.props.amount < 2)){
            this.props.handleAmountChange(parseInt(this.props.amount - 1))
        }
    }

    onPlusClick = () => {
        if (!(this.props.amount > 29)){
            this.props.handleAmountChange(parseInt(this.props.amount + 1))
        }
    }

    onInputChange = (event) => {
        if (event.target.validity.valid) {
            this.setState({amount: parseInt(event.target.value)})
        }
    }

    render() {
        return (
            <div class="count_select_block">
                <span>Количество:</span>
                <div class="count_select">
                    <button type="button" class="count_minus count_char" onClick={this.onMinusClick}>
                        <img src={minus}/>
                    </button>
                    <input type="number" class="cur_selected_count" style={{color: "#000"}} name="count" id="count"  min="0" max="30" value={this.props.amount} onchange={this.onInputChange} disabled />
                    <button type="button" class="count_plus count_char" onClick={this.onPlusClick}>
                        <img src={plus}/>
                    </button>
                </div>
            </div>
        )
    }
}

export default AmountSelectButton;