import { ref } from 'vue'

export function useFirebase () {
  const errorMessage = ref('')
  async function postApi (callback, ...args) {
    try {
      const res = await callback(...args)
      return res
    } catch (error:any) {
      // useNotify
      console.log(error.message)
      errorMessage.value = error.message
    }
  }

  return {
    errorMessage,
    postApi
  }
}
