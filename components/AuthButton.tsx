import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-red-500 text-white hover:bg-red-700">
          Logout
        </button>
      </form>
   
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-green-500 hover:bg-green-700"
    >
      Login
    </Link>
  )
}
