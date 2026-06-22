import { useState, useEffect, useRef } from 'react';

import Calc from './components/calc';

import historyImage from "./assets/history.png";

function App() {
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <>
      <title>Web電卓</title>
      <div className="App">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className={`
          fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-gray-100 p-4 transition-transform duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="flex justify-between items-center mb-4">
            <h1 className='text-3xl'>History</h1>
            <button onClick={() => setIsOpen(false)} className="text-2xl p-2 md:hidden">✕</button>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 overflow-y-auto flex-col p-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <img src={historyImage} style={{ width: "20px" }} />
            </button>
            <h1 className="text-xl">Web Calc</h1>
          </div>
        </div>

        <Calc />
      </div>
    </>
  )
}

export default App
