import { useState, useEffect, useRef } from 'react';

import Calc from './components/calc';

import historyImage from "./assets/history.png";
import trashImage from "./assets/trash.png";

function App() {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [ isOpen, setIsOpen ] = useState(false);
  const [ history, setHistory ] = useState([]);

  const handleEqualClicked = (left, mode, right, result) => {
    setHistory([...history, {left, mode, right, result}]);
  }
  
  const [ selectedHistory, setSelectedHistory ] = useState(null);

  useEffect(() => {
    const touchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    }

    const touchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].screenX;
      handleGesture();
    }

    const handleGesture = () => {
      const diff = touchEndX.current - touchStartX.current;

      if(diff > 50) {
        setIsOpen(true);
      }
      if(diff < -50) {
        setIsOpen(false);
      }
    }

    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchend", touchEnd);

    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
    };
  });

  return (
    <>
      <title>Web電卓</title>
      <div className="App min-h-screen bg-gray-300">
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
            <button onClick={() => setIsOpen(false)} className="text-2xl p-2">✕</button>
          </div>
          {history.length > 0 ? history.map((form, index) => (
            <div
              key={index}
              className={`mb-1 p-2 rounded shadow cursor-pointer hover:bg-gray-100 bg-white flex justify-between items-center`}
            >
              <div
                onClick={() => {
                  setSelectedHistory(form);
                  setIsOpen(false);
                }}
              >
                {form.left} {form.mode} {form.right} = {form.result}
              </div>
              <button
                className='p-2 rounded hover:bg-gray-200'
                onClick={() => {
                  setHistory((prevHistory) =>
                    prevHistory.filter((_, i) => i !== index)
                  );
                }}
              >
                <img src={trashImage} style={{ width: "25px" }} />
              </button>
            </div>
          )) : (
            <>履歴がありません</>
          )}
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

        <Calc
          onEqualClicked={handleEqualClicked}
          callHistory={selectedHistory}
        />
      </div>
    </>
  )
}

export default App
