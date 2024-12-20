'use client'

import { MenubarItem } from '@dbbs/tailwind-components'
import { signOut } from 'next-auth/react'

const SignOutMenubarItem = () => (
  <MenubarItem
    onClick={() => {
      signOut()
    }}
  >
    Sign out
  </MenubarItem>
)

export default SignOutMenubarItem
