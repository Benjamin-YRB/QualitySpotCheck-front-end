export default {
  state: {
    isLogin: false,
    user: {},
    role: {},
    item: [],
    token: ''
  },
  mutations: {
    loginInit(state,data){
      // console.log(data);
      state.user = data.data.user;
      state.role = data.data.role;
      state.item = data.data.item;
      state.token = data.data.token;
    }
  },
  getters:{
    getToken(state){
      return state.token ? state.token : localStorage.getItem('token');
    },
    getItem(state){
      return state.item.length !== 0 ? state.item : JSON.parse(localStorage.getItem('item'));
    }
  }
}