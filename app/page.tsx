

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="w-full flex flex-col items-center">
      {!user ? <div>Please sign in</div>: <div>thanks for signing in guy</div>}
    </div>
  )
}
