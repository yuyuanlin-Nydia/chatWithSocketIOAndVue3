<template>
  <div class="loginBox">
    <div class="login">
      <form @submit.prevent="onSubmit">
        <h5 class="title">
          Hi,Welcome!
        </h5>
        <p class="subTitle">
          Begin a conversation and have a good day.
        </p>
        <div class="tabArea">
          <div
            :class="[activeTab==='LogIn'? 'active':'']"
            @click="activeTab = 'LogIn'"
          >
            LogIn
          </div>
          <div
            :class="[activeTab==='SignUp'? 'active':'']"
            @click="activeTab = 'SignUp'"
          >
            SignUp
          </div>
        </div>
        <section
          class="formArea"
        >
          <div
            class="formItem"
          >
            <label>Account :</label>
            <input
              id="useName"
              v-model="userName"
              type="text"
              name=""
              placeholder="Your account"
            >
          </div>
          <div class="formItem">
            <label>Password :</label>
            <input
              id="userPassword"
              v-model="userPassword"
              type="text"
              name=""
              placeholder="Your password"
            >
          </div>
        </section>
        <button
          type="submit"
          class="btnWithOrange loginBtn"
        >
          {{ activeTab }}
        </button>
      </form>

      - OR - <br>
      Sign up With
      <br><br>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import socket from '@/utilities/socketConnection'

const store = useStore()
const userName = ref('sandy6513a@yahoo.com.tw')
const userPassword = ref('rdtest1153')
const router = useRouter()
const activeTab = ref('LogIn')

const onSubmit = async () => {
  activeTab.value === 'LogIn' ? logInDispatch() : signUpDispatch()
}
async function logInDispatch () {
  store.dispatch('logIn', {
    userName: userName.value,
    userPassword: userPassword.value
  })
}
function signUpDispatch () {
  store.dispatch('signup', {
    userName: userName.value,
    userPassword: userPassword.value
  })
}
const logInStat = computed(() => store.state.appModule.isLogIn)
socket.on('loginStat', (logInSuccess) => {
  store.commit('getLogInStat', logInSuccess)
})
watch(logInStat, (newValue) => {
  if (newValue) {
    router.push('/chat')
  }
})

</script>

<style lang="scss" scoped>
.loginBox{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .tabArea{
    display: flex;
    justify-content: space-around;
    background-color: white;
    color:black;
    padding: 10px;
    margin: 10px 0;
    cursor: pointer;
    >.active{
      background-color: $bg-primary-blue;
      color:white;
    }
    >div{
      padding: 2% 8%;
    }

  }
  .login{
    border-radius: 30px;
    width: 25%;
    @media screen and (max-width:1000px) {
      width: 50%;
    }
    max-width: 500px;
    padding: 50px;
    background-color: rgb(242, 240, 240);
    .title{
      color: $bg-primary-blue;
      font-weight: bold;
    }
    .subTitle{
      color: $dark-grey;
      margin: 2% 0 6% 0;
    }
    .loginBtn{
      border-radius:30px;
      width: 100%;
      padding: 3% 0;
      box-shadow: 0px 1px 5px black;
      margin: 5% 0;
    }
  }
  .formArea{
    display: flex;
    flex-direction: column;
    width: 100%;
    .formItem{
      margin: 2% 0;
      display: flex;
      flex-direction: column;
      >label{
        font-size: 12px;
        color: $dark-grey;
        font-weight: 700;
        margin: 1.5% 0;
      }
    }
  }
}
</style>
