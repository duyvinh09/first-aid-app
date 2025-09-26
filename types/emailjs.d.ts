declare global {
  interface Window {
    emailjs?: {
      init: (config: { publicKey: string }) => void
      send: (
        serviceId: string,
        templateId: string,
        templateParams?: Record<string, any>,
      ) => Promise<any>
      sendForm: (
        serviceId: string,
        templateId: string,
        form: HTMLFormElement,
      ) => Promise<any>
    }
    __emailjs_initialized__?: boolean
  }
}

export {}


