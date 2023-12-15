

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import DocumentTable from "@/components/DocumentTable"

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="w-full flex flex-col items-center">
      {!user ? <div>Please sign in</div>: <DocumentTable/>}
    </div>
  )
}
