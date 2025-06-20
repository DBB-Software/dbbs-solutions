import { Search } from 'lucide-react'
import { Link, useNavigate } from '@remix-run/react'
import { type FormEventHandler, PropsWithChildren } from 'react'
import {
  Input,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@dbbs/tailwind-components'
import { useAppState } from './store/app'

export default function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const [{ user }, { onLogOut }] = useAppState()

  const onSignOut = async () => {
    await fetch('/sign-out', { method: 'POST' })
    onLogOut()
  }

  const onGoSearch: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault()

    const inputElement = ev.currentTarget.elements[0] as HTMLInputElement
    const value = inputElement?.value || ''

    if (value.trim()) {
      navigate(`/r/${value}`)
      inputElement.value = ''
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                <Link to="/">Reddits</Link>
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <form className="relative" onSubmit={onGoSearch}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search..." className="pl-8 pr-4" name="search" />
              </form>
              {user ? (
                <Menubar className="p-0 border-0">
                  <MenubarMenu>
                    <MenubarTrigger className="p-0 outline-0 cursor-pointer">{user.name}</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>
                        <Link to="/profile/edit">Edit Profile</Link>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <Link to="/my-searches">My Searches</Link>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem onClick={onSignOut}>Sign out</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              ) : (
                <div className="d-flex">
                  <Link className="mr-2" to={'/login'}>
                    Sign In
                  </Link>
                  <Link to={'/sign-up'}>Sign Up</Link>
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
