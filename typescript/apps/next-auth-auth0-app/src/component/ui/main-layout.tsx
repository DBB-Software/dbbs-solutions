import { Search } from 'lucide-react'

import { PropsWithChildren } from 'react'
import {
  Input,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@dbbs/tailwind-components'

import Link from 'next/link'
import { auth } from '../../auth'
import SignOutMenubarItem from './sing-out-menubar-item'

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                <Link href="/">Reddits</Link>
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search..." className="pl-8 pr-4" name="search" />
              </form>
              {session ? (
                <Menubar className="p-0 border-0">
                  <MenubarMenu>
                    <MenubarTrigger className="p-0 outline-0 cursor-pointer">
                      {session?.user?.name || session?.user?.email}
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>
                        <Link href="/profile/edit">Edit Profile</Link>
                      </MenubarItem>
                      <MenubarSeparator />
                      <SignOutMenubarItem />
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login">Sign In</Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 container mx-auto">{children}</main>
      </div>
    </div>
  )
}
