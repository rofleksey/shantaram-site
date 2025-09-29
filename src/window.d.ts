declare global {
  interface Window {
    __backgroundVideoState: {
      shouldPlay: boolean;
    };
  }
}

export {};