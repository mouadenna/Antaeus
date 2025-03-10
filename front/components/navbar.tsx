"use client"

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 m-0 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4 m-0">
        <a href="/" className="flex items-center space-x-0 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Antaeus</span>
        </a>
      </div>
    </nav>
  )
}

