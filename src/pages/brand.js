import React from 'react'
import Layout from '../components/layout'
import logos from '../images/logo'

export default function Brand() {
  return (
    <Layout>
      <h1 className="text-4xl font-semibold mb-8 text-center">
        Branding Assets
      </h1>
      <h2 className="text-xl font-semibold mb-6 text-center">Avatars</h2>
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-10">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="p-3 flex flex-col items-center justify-center"
          >
            <img src={logo.svg} alt={logo.name} />
            <div className="mt-3 text-xs text-gray-600">{logo.name}</div>
            <div className="mt-2 flex">
              <a
                href={`/images/logo/${logo.name}.svg`}
                download
                className="mx-1 inline-flex items-center p-2 border border-gray-200 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                {/* prettier-ignore */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-5 -5 24 24"><g fill="currentColor"><path d="M8 6.641l1.121-1.12a1 1 0 0 1 1.415 1.413L7.707 9.763a.997.997 0 0 1-1.414 0L3.464 6.934A1 1 0 1 1 4.88 5.52L6 6.641V1a1 1 0 1 1 2 0v5.641zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z"></path></g></svg>
                SVG
              </a>
              <a
                href={`/images/logo/${logo.name}@2x.png`}
                download
                className="mx-1 inline-flex items-center p-2 border border-gray-200 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-indigo-600 focus:outline-none focus:border-indigo-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                {/* prettier-ignore */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-5 -5 24 24"><g fill="currentColor"><path d="M8 6.641l1.121-1.12a1 1 0 0 1 1.415 1.413L7.707 9.763a.997.997 0 0 1-1.414 0L3.464 6.934A1 1 0 1 1 4.88 5.52L6 6.641V1a1 1 0 1 1 2 0v5.641zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z"></path></g></svg>
                PNG
              </a>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
