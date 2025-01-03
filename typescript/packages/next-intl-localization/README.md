## Name: next-intl-localization

## Description

The next-intl-localization is a wrapper around the next-intl package that simplifies localization and internationalization in Next.js applications. This package re-exports functionalities from next-intl, making it an ideal solution for multilingual applications.

## Usage

Install `@dbbs/next-intl-localization` into your application using yarn.

```bash
yarn add @dbbs/next-intl-localization
```

## Examples

### Page router

- Install ```yarn add @dbbs/next-intl-localization```
- Set up  [internationalized routing](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)
- Add provider in ``_app.tsx``

```ts
import type { Metadata } from 'next'
import type { AppProps } from 'next/app'
import '../styles/global.css'
import { NextIntlClientProvider } from '@dbbs/next-intl-localization/client'
import { useRouter } from 'next/router'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  return (
    <NextIntlClientProvider locale={router.locale} timeZone="Europe/Vienna" messages={pageProps.messages}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  )
}
```

- Provide messages on a page-level

```ts
import { GetStaticPropsContext } from 'next'
import { Button } from '@dbbs/tailwind-components'
import { useTranslations } from '@dbbs/next-intl-localization/client'

export default function Home() {
  const t = useTranslations()
  return (
    <div>
      <p>{t('title')}</p>
      <Button data-testid="app-title">Hello from NextJS!</Button>
    </div>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by locale and read
      // the desired one based on the `locale` received from Next.js.
      messages: (await import(`../../messages/${context.locale}.json`)).default
    }
  }
}
```


### App router

- Install ```yarn add @dbbs/next-intl-localization```
- create structure 
```
├── messages
│   ├── en.json (1)
│   └── ...
├── next.config.mjs (2)
└── src
    ├── i18n
    │   └── request.ts (3)
    └── app
        ├── layout.tsx (4)
        └── page.tsx (5)
```

- add messages ``messages/en.json``
```json
{
    "hello": "Hello world!"
}
```
- next.config.mjs
```ts
import createNextIntlPlugin from '@dbbs/next-intl-localization/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@dbbs/tailwind-components']
}

export default withNextIntl(nextConfig)
```
- i18n/request.ts

```ts
import { getRequestConfig } from '@dbbs/next-intl-localization/server'

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
```
- app/layout.tsx
```ts
import type { Metadata } from 'next'
import { type ReactNode } from 'react'
import './global.css'
import { NextIntlClientProvider } from '@dbbs/next-intl-localization/client'
import { getLocale, getMessages } from '@dbbs/next-intl-localization/server'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```
- app/page.tsx
```ts
import { Button } from '@dbbs/tailwind-components'
import { useTranslations } from '@dbbs/next-intl-localization'

export default function Home() {
  const t = useTranslations()

  return <Button data-testid="app-title">{t('hello')}</Button>
}

```

## Features
- The package provides translation tools for app and page router of next.js

## Feature Keywords

- i18n
- web-ssr
- web-spa
- nextjs

## Language and framework

- Next.js
- JavaScript
- TypeScript

## Type

- Package

## Tech Category

- Front-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Relations

- /typescript/apps/*

## External dependencies

N/A
