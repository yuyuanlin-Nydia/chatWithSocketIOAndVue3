<template>
  <div class="loginBox">
    <div class="login">
      <form @submit.prevent="onSubmit">
        <h1 class="title">
          Hi,Welcome!256
        </h1>
        <h6 class="subTitle">
          Begin a conversation and have a good day.
        </h6>
        <div class="tabArea">
          <div
            :class="[activeTab==='LogIn'? 'active':'']"
            @click="activeTab = 'LogIn'"
          >
            LOGIN
          </div>
          <div
            :class="[activeTab==='SignIn'? 'active':'']"
            @click="activeTab = 'SignIn'"
          >
            SignIn
          </div>
        </div>
        <section
          v-if="activeTab ==='LogIn'"
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
      Sign in With
      <br><br>
      <p>Don't have an account? <b>Sign up</b></p>
    </div>
    <div
      v-if="errMsg"
      style="color:red"
    >
      {{ errMsg }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import socket from '@/utilities/socketConnection'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const store = useStore()
const userName = ref('sandy6513a@yahoo.com.tw')
const userPassword = ref('rdtest1153')
const errMsg = computed(() => store.state.appStore.errMsg)
const router = useRouter()
const onSubmit = () => {
  console.log(userName.value)
  const auth = getAuth()
  signInWithEmailAndPassword(auth, userName.value, userPassword.value)
    .then((userCredential) => {
    // Signed in
      const user = userCredential.user
      console.log(user)
    // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
    })
  // store.commit('logIn', {
  //   account: userName.value,
  //   password: userPassword.value
  // })
}
const logInStat = computed(() => store.state.appStore.isLogIn)
socket.on('loginStat', (logInSuccess) => {
  store.commit('getLogInStat', logInSuccess)
})
watch(logInStat, () => {
  if (logInStat.value) {
    router.push('/chat')
  }
})

const activeTab = ref('LogIn')

// const db = getFirestore()
// const docSnap = await getDoc(doc(db, 'Message', 'zb5CCMoHqytaGSdVtS3B'))

// if (docSnap.exists()) {
//   console.log(docSnap.data())
// }

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

  }
  .login{
    border-radius: 30px;
    width: 25%;
    @media screen and (max-width:1000px) {
      width: 35%;
    }
    max-width: 500px;
    padding: 60px;
    background-color: rgb(242, 240, 240);
    .title{
      color: $bg-primary-blue;
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
