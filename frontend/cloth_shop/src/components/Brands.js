import React, {useState} from 'react';


function Brands(props) {

    const [isEverShown, setIsEverShown] = useState(false);
    const [isShown, setIsShown] = useState(false);

    const brands = props.resource.brands.read().data.results;
    console.log(brands);


    return (
        <div class="filter_content filter_list season_list">
            {brands.map(brand => <Brand brand={brand} setBrand={props.setBrand} onBrandChange={props.onBrandChange}/>)}
        </div>
    )
}

function Brand(props) {
    return (
        <label key={props.brand.name}>
            <input type="checkbox" name={props.brand.name} value={props.brand.name} onChange={props.onBrandChange}/>
            <span>{props.brand.name}</span>
        </label>
    )
}

export default Brands;