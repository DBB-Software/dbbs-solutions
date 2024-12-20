interface Window {
  ApplePaySession: typeof ApplePaySession
}

declare namespace JSX {
  interface IntrinsicElements {
    'apple-pay-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      buttonstyle?: 'black' | 'white' | 'white-outline'
      type?:
        | 'plain'
        | 'buy'
        | 'donate'
        | 'checkout'
        | 'book'
        | 'subscribe'
        | 'reload'
        | 'add-money'
        | 'top-up'
        | 'order'
        | 'rent'
        | 'support'
        | 'contribute'
        | 'tip'
    }
  }
}
