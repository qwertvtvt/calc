import { useState, useEffect, useRef } from "react";
import "./style.css"

const Calc = () => {
    const [ display, setDisplay ] = useState(0);
    const [ left, setLeft ] = useState(0);
    const [ right, setRight ] = useState(0);
    const [ mode, setMode ] = useState(null);
    
    const keys = [
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        ["0", ".", "=", "+"]
    ];

    function handleKey(key) {
        if(!isNaN(key)) {
            const number = Number(key);
            let newNum = 0;
            if(!mode) {
                newNum = left * 10 + number;
                setLeft(newNum);
            } else {
                newNum = right * 10 + number;
                setRight(newNum);
            }
            setDisplay(newNum);
            return;
        }

        if(key == "=") {
            let result = 0;
            if(mode == "+") {
                result = left + right;
            } else if(mode == "-") {
                result = left - right;
            } else if(mode == "*") {
                result = left * right;
            } else if(mode == "/") {
                result = left / right;
            }
            setDisplay(result);
            setLeft(0);
            setRight(0);
            setMode(null);

            return;
        }

        setMode(key);
        if(mode && right !== 0) {
            let result = 0;
            if(key == "+") {
                setLeft(left + right);
                setRight(0);
                setDisplay(left + right);
            } else if(key == "-") {
                setLeft(left - right);
                setRight(0);
                setDisplay(left - right);
            } else if(key == "*") {
                setLeft(left * right);
                setRight(0);
                setDisplay(left * right);
            } else if(key == "/") {
                setLeft(left / right);
                setRight(0);
                setDisplay(left / right);
            }
        }
    }

    useEffect(() => {
        console.log(`${left} ${mode ? mode : ""} ${right ? right : ""}`);
        return;
    }, [left, mode, right]);

    return (
        <div className="calc">
            <span>{mode}</span><br />
            <input type="number" value={display} className="result" readOnly />

            {keys.map((row, i) => (
                <div className="buttons-4" key={i}>
                    {row.map((key) => (
                        <input
                            key={key}
                            type="button"
                            value={key}
                            className="btn"
                            onClick={() => handleKey(key)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Calc;