import Vue from 'vue'
import Vuex from 'vuex'
import dailog from './modules/dailog'
import login from './modules/login'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        dailog,
        login
    }
});
export default store;