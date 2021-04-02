import React from 'react';

const Brands = props => {
    return (
        props.map(brand => {
            <label>
                <input type="checkbox" name="brand" value={brand.name}>
                <span>{brand.name}</span>
            </label>
        })



    )
}