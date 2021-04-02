import React from 'react';

import SizeList from './SizeList.js';

class SizeSelectButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
        this.currentSelectedSize = this.currentSelectedSize.bind(this);
    }

    currentSelectedSize = () => {
        if (this.props.sizes) {
            return this.props.sizes[0]
        }
        return "Нет в наличии"
    }

    render() {
        return (
            <div class="item_size item_info_list">
                <span>Размер:</span>

                <div class="radio_select" id="size_select" onClick={() => this.setState({isOpen: !this.state.isOpen})}>
                    <span class="cur_selected_size">{this.currentSelectedSize()}</span>
                </div>
                <div className={this.state.isOpen ? "select_list list-open" : "select_list"}>
                    <div class="select_list_wrapper" onClick={() => this.setState({isOpen: false})}>
                        {this.props.sizes && <SizeList sizes={this.props.sizes} handleSizeChange={this.props.handleSizeChange}/>}
                    </div>
                </div>
            </div>
        )
    }
}

export default SizeSelectButton;