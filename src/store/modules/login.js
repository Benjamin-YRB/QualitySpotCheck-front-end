export default {
  state: {
    loginCondition:{
      user: {},
      role: {},
      item: []
    }
  },
  mutations: {
    loginInit(state,data){
      // console.log(data);
      state.loginCondition.user = data.data.user;
      state.loginCondition.role = data.data.role;
      state.loginCondition.item = data.data.item;
    }
  }
}