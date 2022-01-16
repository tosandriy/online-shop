import React, {Suspense, useState} from 'react';
import {fetchShippingInfoData, postShippingInfo} from '../Api';
import { useStore } from 'react-redux';


const handleInputChange = (inputName, e) => {
    this.setState({inputName: e.target.value});
}

const handlePersonalDataFormToggle = (e) => {
    this.setState({isPersonalDataFormLocked: !this.state.isPersonalDataFormLocked});
}

const handleShippingDataFormToggle = (e) => {
    this.setState({isShippingDataFormLocked: !this.state.isShippingDataFormLocked});
}



export default function Profile(props) {

    const [isPersonalDataFormLocked, setIsPersonalDataFormLocked] = useState(true);
    const [isShippingDataFormLocked, setIsShippingDataFormLocked] = useState(true);
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymicName, setPatronymicName] = useState("");
    const [phone, setPhone] = useState("");

    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [street, setStreet] = useState("");
    const [house, setHouse] = useState("");
    const [flat, setFlat] = useState("");
    const [index, setIndex] = useState("");
    const [resource, setResource] = useState();

    const [loaded, setLoaded] = useState(false);

    const store = useStore();

    const state = store.getState();
    console.log(state.auth.token);
    if (state.auth.token !== null && !loaded) {
        setLoaded(true);
        setToken(state.auth.token);
        console.log(state.auth.token);
        const resource = fetchShippingInfoData(state.auth.token);
        setResource(resource);
    }



    const sendUserInfo = () => {
        console.log(token);
        postShippingInfo(token, name, surname, patronymicName, phone, country,
        city, region, street, house, flat, index)
    };

    return (
        <>
            <Suspense fallback={"loading..."}>
                <div class="accaunt_settings">
                    <PersonalInfoForm
                        isPersonalDataFormLocked={isPersonalDataFormLocked}
                        setIsPersonalDataFormLocked={setIsPersonalDataFormLocked}
                        name={name}
                        setName={setName}
                        surname={surname}
                        setSurname={setSurname}
                        patronymicName={patronymicName}
                        setPatronymicName={setPatronymicName}
                        phone={phone}
                        setPhone={setPhone}
                        resource={resource}
                        sendUserInfo={sendUserInfo}
                    />
                    <ShippingInfoForm
                        isShippingDataFormLocked={isShippingDataFormLocked}
                        setIsShippingDataFormLocked={setIsShippingDataFormLocked}
                        country={country}
                        setCountry={setCountry}
                        city={city}
                        setCity={setCity}
                        region={region}
                        setRegion={setRegion}
                        street={street}
                        setStreet={setStreet}
                        house={house}
                        setHouse={setHouse}
                        flat={flat}
                        setFlat={setFlat}
                        index={index}
                        setIndex={setIndex}
                        resource={resource}
                        sendUserInfo={sendUserInfo}
                    />
                </div>
            </Suspense>
        </>
    )
}

class PersonalInfoForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shippingInfoData: this.props.resource.shippingInfo.read().data
        }
    }

    render() {
        return (
            <form class="settings_form">
            <h2 class="change_title change_title_personal">
                <span>Персональные данные</span>
                <span class="change_btn change_btn_personal" onClick={(e) => this.props.setIsPersonalDataFormLocked(!this.props.isPersonalDataFormLocked)}>Изменить</span>
            </h2>
            <a href="#" class="change_password">Сменить пароль</a>
            <div>
                <span class="input_title">Имя</span><br/>
                <input type="text" name="name" onChange={(e) => this.props.setName(e.target.value)} defaultValue={this.state.shippingInfoData.first_name} class="settings_input settings_input_personal" disabled={this.props.isPersonalDataFormLocked ? "disabled" : ""}/>
            </div>
            <div>
                <span class="input_title">Фамилия</span><br/>
                <input type="text" name="surname" onChange={(e) => this.props.setSurname(e.target.value)} defaultValue={this.state.shippingInfoData.surname} class="settings_input settings_input_personal" disabled={this.props.isPersonalDataFormLocked ? "disabled" : ""}/>
            </div>
            <div>
                <span class="input_title">Отчество</span><br/>
                <input type="text" name="patronymic_name" onChange={(e) => this.props.setPatronymicName(e.target.value)} defaultValue={this.state.shippingInfoData.patronymic} class="settings_input settings_input_personal" disabled={this.props.isPersonalDataFormLocked ? "disabled" : ""}/>
            </div>
            <div>
                <span class="input_title">Телефон</span><br/>
                <input type="text" name="phone" onChange={(e) => this.props.setPhone(e.target.value)} defaultValue={this.state.shippingInfoData.phone_number} class="settings_input settings_input_personal" disabled={this.props.isPersonalDataFormLocked ? "disabled" : ""}/>
            </div>
            <button type='button' onClick={this.props.sendUserInfo} class="accaunt_menu_btn settings_save settings_save_persanal">Сохранить</button>
        </form>
        )

    }
}

class ShippingInfoForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shippingInfoData: this.props.resource.shippingInfo.read().data
        }
    }

    render() {
        return (
            <form class="settings_form">
                <h2 class="change_title change_title_address">
                    <span>Адрес доставки</span>
                    <span class="change_btn change_btn_address" onClick={(e) => this.props.setIsShippingDataFormLocked(!this.props.isShippingDataFormLocked)}>Изменить</span>
                </h2>
                <div>
                    <span class="input_title">Страна</span><br/>
                    <input type="text" name="country" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.country} onChange={(e) => this.props.setCountry(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Город</span><br/>
                    <input type="text" name="city" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.city} onChange={(e) => this.props.setCity(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Регион</span><br/>
                    <input type="text" name="region" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.region} onChange={(e) => this.props.setRegion(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Улица</span><br/>
                    <input type="text" name="street" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.street} onChange={(e) => this.props.setStreet(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Дом</span><br/>
                    <input type="text" name="building" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.building} onChange={(e) => this.props.setHouse(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Квартира</span><br/>
                    <input type="text" name="flat" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.flat} onChange={(e) => this.props.setFlat(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <div>
                    <span class="input_title">Индекс</span><br/>
                    <input type="text" name="index" class="settings_input settings_input_address" defaultValue={this.state.shippingInfoData.index} onChange={(e) => this.props.setIndex(e.target.value)} disabled={this.props.isShippingDataFormLocked ? "disabled" : ""}/>
                </div>
                <button type='button' onClick={this.props.sendUserInfo} class="accaunt_menu_btn settings_save settings_save_address ">Сохранить</button>
            </form>
        )
    }
}

