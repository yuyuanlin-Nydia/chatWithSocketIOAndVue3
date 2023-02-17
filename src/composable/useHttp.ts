import { Notify } from 'quasar'

export function useHttp () {
  async function postApi (callback, ...args: any[]) {
    try {
      const res = await callback(...args)
      return res
    } catch (error: any) {
      Notify.create({
        message: error.message,
        type: 'negative'
      })
    }
  }

  return {
    postApi
  }
}
