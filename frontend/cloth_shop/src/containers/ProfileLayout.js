import React, {Suspense} from 'react';
import {
 BrowserRouter as Router,
 Switch,
 Route,
 useRouteMatch,
 Link} from 'react-router-dom';
 import { connect } from 'react-redux';
import Profile from '../components/Profile'
import Orders from '../components/Orders'
import {fetchShippingInfoData, postShippingInfo} from '../Api';
import * as actions from '../store/actions/auth.js'


class ProfileLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            path: window.location.pathname,
            initialResource: null
        }

        this.onLogoutButtonClick = this.onLogoutButtonClick.bind(this);
    }

    componentDidUpdate(newProps) {
        let store = newProps.store;
        if (store) {
            let state = store.getState();
            if (state.auth.token !== null) {
                const initialResource = fetchShippingInfoData(state.auth.token);
                this.setState({initialResource: initialResource});
            }
        }
    }

    onLogoutButtonClick = (e) => {
        this.props.onLogout();
    }

    render() {
        return (
            <main id="main" class="main_item">
                <div class="main_content profile_content">
                    <div class="accaunt_menu">
                        <Link to={"/profile"}><button class={window.location.pathname === "/profile" ? "accaunt_menu_btn accaunt_menu_btn_page accaunt_menu_btn_profile accaunt_menu_btn_active" : "accaunt_menu_btn accaunt_menu_btn_page accaunt_menu_btn_profile"}>Профиль</button></Link>
                        <Link to={"/profile/purchase_history"}><button class={window.location.pathname === "/profile/purchase_history" ? "accaunt_menu_btn accaunt_menu_btn_page accaunt_menu_btn_profile accaunt_menu_btn_active" : "accaunt_menu_btn accaunt_menu_btn_page accaunt_menu_btn_profile"}>Заказы</button></Link>
                        <button onClick={this.onLogoutButtonClick} class="accaunt_menu_btn accaunt_menu_btn_logout">Выйти</button>
                    </div>
                    <div class="accaunt_page">

                            <Switch>
                                <Route exact path={`/profile/`} initialResource={this.state.initialResource} component={Profile}/>
                                <Route path={`/profile/purchase_history`} component={Orders}/>
                            </Switch>

                    </div>
                </div>
            </main>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToProps)(ProfileLayout);