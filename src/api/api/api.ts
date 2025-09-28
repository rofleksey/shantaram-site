import axios from 'axios'
import PQueue from 'p-queue'
import {DefaultApiFactory, type DefaultApiInterface} from "../oapi";
import {onBeforeMount, onBeforeUnmount} from "vue";

export const BASE_API_URL = import.meta.env.DEV ? "http://localhost:8080/v1" : "https://api.shantaram-spb.ru/v1"

export interface ApiClientOptions {
  concurrency?: number,
  intervalCap?: number,
  interval?: number,
}

export class ApiClient {
  public api: DefaultApiInterface

  public isDestroyed = false
  private controller: AbortController

  constructor(opts?: ApiClientOptions) {
    const controller = new AbortController()

    const instance = axios.create({
      baseURL: BASE_API_URL,
      timeout: 15000,
      signal: controller.signal,
    })

    const api = {
      ...DefaultApiFactory(undefined, "", instance),
    }

    const queue = new PQueue({
      concurrency: opts?.concurrency ?? 1,
      intervalCap: opts?.intervalCap ?? Infinity,
      interval: opts?.interval ?? 0,
      throwOnTimeout: true
    })

    for (const key in api) {
      // @ts-ignore
      const original = api[key]

      if (typeof original !== 'function') {
        continue
      }

      // @ts-ignore
      api[key] = function () {
        return queue.add(() => original.apply(api, arguments))
      }
    }

    this.api = api
    this.controller = controller
  }

  destroy() {
    this.isDestroyed = true
    this.controller.abort()
  }
}

export function useApiClient(opts?: ApiClientOptions): ApiClient {
  let client = new ApiClient(opts)

  onBeforeMount(() => {
    if (client.isDestroyed) {
      client = new ApiClient(opts)
    }
  })

  onBeforeUnmount(() => {
    client.destroy()
  })

  return client
}

export function getErrorText(error: any) {
  let description: string
  if (error.response?.data?.msg) {
    description = error.response?.data?.msg?.toString?.()
  } else if (error.response?.data) {
    description = error.response?.data?.toString?.()
  } else if (error.message) {
    description = error.message?.toString?.()
  } else {
    description = error?.toString?.() ?? '?'
  }
  return description
}
