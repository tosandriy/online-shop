import React from 'react';


class Size extends React.Component {
    render() {
        return (
            <label class="size_label">
                <input onChange={this.props.handleSizeChange} type="radio" name="size" value={this.props.size} key={this.props.size}/>
                <span>{this.props.size}</span>
            </label>
        )
    }
}

class SizeList extends React.Component {

    render() {
        return (
            this.props.sizes.map(size =>
                <Size size={size} handleSizeChange={this.props.handleSizeChange}/>
            )
        )
    }
}

export default SizeList;