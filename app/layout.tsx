
import './globals.css'
import Navbar from "@/components/Navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="text-black max-h-screen ">
      <div className="max-w-screen w-screen max-h-screen h-screen divide-y divide-slate-200 bg-white font-sans">
        <Navbar/>
        <div className='flex flex-col items-center w-full'>
          {children}
          </div>
          </div>
      </body>
    </html>
  )
}
