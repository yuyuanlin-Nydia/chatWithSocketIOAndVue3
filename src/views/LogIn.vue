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
            :class="[activeTab==='Login'? 'active':'']"
            @click="setTab('Login')"
          >
            Login
          </div>
          <div
            :class="[activeTab==='Signup'? 'active':'']"
            @click="setTab('Signup')"
          >
            Signup
          </div>
        </div>
        <section
          class="formArea"
        >
          <div
            class="formItem"
          >
            <label for="email">Email :</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              placeholder="Please enter your email."
              autoComplete="true"
              @keyup.a="setInputValueA"
              @keyup.b="setInputValueB"
            >
          </div>
          <div class="formItem">
            <label for="password">Password :</label>
            <input
              id="password"
              v-model="password"
              class="input"
              type="password"
              placeholder="Please enter your password."
              autoComplete="true"
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
      <br>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import socket from '@/utilities/socketConnection'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useStore()
const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const activeTab = ref('Login')
const loginStat = computed(() => store.state.appModule.isLogIn)

const onSubmit = async () => {
  activeTab.value === 'Login' ? onLogin() : onSignup()
}

function setInputValueA () {
  email.value = 'sandy6513a@yahoo.com.tw'
  password.value = 'rdtest1153'
}

function setInputValueB () {
  email.value = 'test1234@yahoo.com.tw'
  password.value = 'test1234'
}

async function onLogin () {
  await store.dispatch('appModule/login', {
    email: email.value,
    password: password.value
  })
}

async function onSignup () {
  await store.dispatch('appModule/signup', {
    email: email.value,
    password: password.value,
    userName: email.value.split('@')[0]
  })
}

function setTab (tabName:string) {
  activeTab.value = tabName
}
socket.on('loginStat', (loginSuccess) => {
  store.commit('getLogInStat', loginSuccess)
})
watch(loginStat, (newValue) => {
  if (newValue) {
    router.push({ name: 'Chat' })
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
