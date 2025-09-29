declare global {
  interface Window {
    __backgroundVideoState: {
      shouldPlay: boolean;
    };
    ym: (counterId: number, method: string, ...args: any[]) => void;
  }
}

export {};