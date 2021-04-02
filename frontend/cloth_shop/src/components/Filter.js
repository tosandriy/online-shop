import React, {Suspense, useState} from 'react';
import axios from "axios";
import {fetchBrandsData, fetchFilteredProductsData} from '../FetchProductApi.js';

const resource = fetchBrandsData();

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            season_clicked: false,
            size_clicked: false,
            price_clicked: false,
            brand_clicked: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.arrow = this.props.arrow
    }

    onChange = (e) => {
    console.log(e.target.name, e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.onProductsChange(fetchFilteredProductsData(this.props.brand, this.props.season,
        this.props.size, this.props.from, this.props.to,this.props.order, this.props.page))
    }

    render() {
        return (
            <div className="filters">
                <div className="filters_content">
                    <div className="filters_text">
                        <span>Фильтры</span>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="filter_brand filter_block"
                                        onClick={(e) => {this.setState({brand_clicked: !this.state.brand_clicked})}}>

                            <div className="filter_title">
                                Бренд
                                <img src={this.arrow} className={this.state.brand_clicked ? "arrow_filter rotate_arrow" : "arrow_filter" }/>
                            </div>

                            <div className={this.state.brand_clicked ? "filter_container filter_opacity filter_enabled" : "filter_container"}>
                                <Suspense fallback={"Loading"}>
                                    <Brands resource={resource} clicked={this.state.brand_clicked} setBrand={this.props.setBrand}/>
                                </Suspense>
                            </div>

                        </div>
                        <div className="filter_season filter_block"
                                        onClick={(e) => {this.setState({season_clicked: !this.state.season_clicked})}}>
                            <div className="filter_title">
                                Сезон
                                <img src={this.arrow} className="arrow_filter" className={this.state.season_clicked ? "arrow_filter rotate_arrow" : "arrow_filter" }/>
                            </div>
                            <div className={this.state.season_clicked ? "filter_container filter_opacity filter_enabled" : "filter_container"}>
                                <div class="filter_content filter_list season_list">
                                    {[[2, "Лето"],[3, "Зима"],[4, "Осень"],[5, "Весна"]].map( season =>
                                        <label>
                                            <input type="checkbox" name="season" value={season[0]} onChange={(e) => this.props.setSeason(e.target.value)}/>
                                            <span>{season[1]}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="filter_size filter_block"
                                        onClick={(e) => {this.setState({size_clicked: !this.state.size_clicked})}}>
                            <div className="filter_title">
                                Размер
                                <img src={this.arrow} className={this.state.size_clicked ? "arrow_filter rotate_arrow" : "arrow_filter" }/>
                            </div>
                            <div className={this.state.size_clicked ? "filter_container filter_opacity filter_enabled" : "filter_container"}>
                                <div class="filter_content filter_list season_list">
                                    {['XS','S','M','L','XL','XXL'].map( size =>
                                        <label>
                                            <input type="checkbox" name="size" value={size} onChange={(e) => this.props.setSize(e.target.value)}/>
                                            <span>{size}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="filter_price filter_block">
                            <div className="filter_title" onClick={(e) => {this.setState({price_clicked: !this.state.price_clicked})}}>
                                Цена
                                <img src={this.arrow}   className={this.state.price_clicked ? "arrow_filter rotate_arrow" : "arrow_filter" }/>
                            </div>
                                <div className={this.state.price_clicked ? "filter_container filter_opacity filter_enabled" : "filter_container"}
                                        onClick={(e) => {this.setState({price_clicked: true})}}>
                                    <div class="filter_content prise_gap">
                                        <input type="text" name="from" placeholder="От" onChange={(e) => this.props.setFrom(e.target.value)}/>
                                        <input type="text" name="to" placeholder="До" onChange={(e) => this.props.setTo(e.target.value)}/>
                                    </div>
                                </div>
                            <div className="filter_apply filters_text">
                                <button type="submit" className="apply_filters_btn">Применить</button>
                            </div>
                        </div>
                    </form>
                </div>
			</div>
        )
    }
}

function Brands(props) {

    const [isEverShown, setIsEverShown] = useState(false);
    const [isShown, setIsShown] = useState(false);

    const brands = props.resource.brands.read().data.results;
    console.log(brands);


    return (
        <div class="filter_content filter_list season_list">
            {brands.map(brand => <Brand brand={brand} setBrand={props.setBrand}/>)}
        </div>
    )
}

function Brand(props) {
    return (
        <label>
            <input type="checkbox" name={props.brand.name} value={props.brand.name} onChange={(e) => props.setBrand(e.target.value)}/>
            <span>{props.brand.name}</span>
        </label>
    )
}

export default Filter;