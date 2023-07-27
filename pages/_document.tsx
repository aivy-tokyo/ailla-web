import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='overflow-hidden'>
      <Head />
      <body className='w-screen h-screen' style={{ backgroundImage: `url("uraraBackground.gif")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
