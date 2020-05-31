import React from 'react'
import JohnSurprised from '../images/logo/john-surprised.svg'
import Link from '../components/link'

export default () => (
  <div className="w-screen h-screen flex items-center justify-center flex-col">
    <img src={JohnSurprised} alt="Surprised John" className="w-32" />
    <h1 className="mt-5 text-2xl font-semibold">404 — Page Not Found</h1>
    <Link
      to="/"
      className="mt-5 inline-flex items-center p-2 border border-gray-200 text-sm leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
    >
      Home
    </Link>
  </div>
)
