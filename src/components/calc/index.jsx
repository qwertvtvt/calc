import { useState, useEffect, useRef } from "react";
import "./style.css";
import Decimal from "decimal.js/decimal.js";

const Calc = ({ onEqualClicked, callHistory }) => {
    const [ display, setDisplay ] = useState("0");
    const [ left, setLeft ] = useState("0");
    const [ right, setRight ] = useState("0");
    const [ mode, setMode ] = useState(null);
    const [ float, setFloat ] = useState(0);
    const [ mem, setMem ] = useState("0");
    const [ prevKey, setPrevKey ] = useState(null);
    
    const keys = [
        ["AC", "MC", "MR", "M+", "M-"],
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        ["0", ".", "=", "+"]
    ];

    function handleKey(key) {
        console.log(key);
        if(!isNaN(key)) {
            const number = new Decimal(key);
            let newNum = 0;
            if(float == 0) {
                if(!mode) {
                    newNum = new Decimal(left).times(10).plus(number);
                    setLeft(newNum.toString());
                } else {
                    newNum = new Decimal(right).times(10).plus(number);
                    setRight(newNum.toString());
                }
            } else {
                if(!mode) {
                    newNum = new Decimal(left).plus(new Decimal(number).div(float));
                    setLeft(newNum.toString());
                } else {
                    newNum = new Decimal(right).plus(new Decimal(number).div(float));
                    setRight(newNum.toString());
                }
                setFloat(float * 10);
            }
            setDisplay(newNum.toString());
            return;
        }

        if(key == ".") {
            if(float > 0) return;
            setFloat(10);
            return;
        }

        if(key == "=") {
            if(!mode) return;
            let result = "";
            if(mode == "+") {
                result = new Decimal(left).plus(new Decimal(right));
            } else if(mode == "-") {
                result = new Decimal(left).minus(new Decimal(right));
            } else if(mode == "*") {
                result = new Decimal(left).times(new Decimal(right));
            } else if(mode == "/") {
                result = new Decimal(left).div(new Decimal(right));
            }
            onEqualClicked(left, mode, right, result.toString());
            setDisplay(result.toString());
            setLeft("0");
            setRight("0");
            setMode(null);
            setFloat(0);

            return;
        }

        if(key == "AC") {
            setDisplay("0");
            setLeft("0");
            setRight("0");
            setMode(null);
            setFloat(0);
            setMem("0");

            return;
        }
        if(key == "MC") {
            setMem("0");
            return;
        }
        if(key == "MR") {
            setDisplay(mem);
            return;
        }
        if(key == "M+") {
            let result = new Decimal(mem).plus(new Decimal(display));
            setMem(result.toString());
            return;
        }
        if(key == "M-") {
            let result = new Decimal(mem).minus(new Decimal(display));
            setMem(result.toString());
            return;
        }
        if(key == "BS") {
            if(!mode) {
                let newStr = left.slice(0, -1);
                if (newStr === "" || newStr === "-") newStr = "0"; 
                setLeft(newStr);
                setDisplay(newStr);

                if (newStr.includes(".")) {
                    const decimalLength = newStr.split(".")[1].length;
                    setFloat(Math.pow(10, decimalLength + 1));
                } else {
                    setFloat(0);
                }
            } else {
                let newStr = right.slice(0, -1);
                if (newStr === "" || newStr === "-") newStr = "0";
                setRight(newStr);
                setDisplay(newStr);

                if (newStr.includes(".")) {
                    const decimalLength = newStr.split(".")[1].length;
                    setFloat(Math.pow(10, decimalLength + 1));
                } else {
                    setFloat(0);
                }
            }
            return;
        }
        if(key == "+/-") {
            let newNum = "";
            if(!mode) {
                newNum = new Decimal(left).times(-1);
                setLeft(newNum);
            } else {
                newNum = new Decimal(right).times(-1);
                setLeft(newNum);
            }
            setDisplay(newNum);
            return;
        }

        setFloat(0);
        if(mode && right !== 0) {
            let result = 0;
            if(prevKey == "+") {
                result = new Decimal(left).plus(new Decimal(right));
            } else if(prevKey == "-") {
                result = new Decimal(left).minus(new Decimal(right));
            } else if(prevKey == "*") {
                result = new Decimal(left).times(new Decimal(right));
            } else if(prevKey == "/") {
                result = new Decimal(left).div(new Decimal(right));
            }
            setMode(prevKey);
            setPrevKey(key);
            setLeft(result.toString());
            setRight("0");
            setDisplay(result.toString());
        }
        setMode(key);
    }

    const handleKeyRef = useRef(handleKey);
    useEffect(() => {
        handleKeyRef.current = handleKey;
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if(!isNaN(event.key)) {
                handleKeyRef.current(event.key);
                return;
            }
            if(event.key == "Enter") {
                handleKeyRef.current("=");
                return;
            }
            if(event.key == "Backspace") {
                handleKeyRef.current("BS");
                return;
            }
            if(event.key == "Escape") {
                handleKeyRef.current("AC");
                return;
            }
            if(["+", "-", "*", "/", "."].includes(event.key)) {
                handleKeyRef.current(event.key);
                return;
            }
            return;
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    useEffect(() => {
        if(!callHistory) return;

        if(!mode) {
            setLeft(callHistory.result);
        } else {
            setRight(callHistory.result);
        }
        setFloat(0);
        setDisplay(callHistory.result);
    }, [callHistory]);

    const displayRef = useRef(null);
    const [ fontSize, setFontSize ] = useState(48);

    useEffect(() => {
        const el = displayRef.current;
        if(!el) return;

        let size = 48;
        el.style.fontSize = `${size}px`;

        while(el.scrollWidth > el.clientWidth && size > 16) {
            size--;
            el.style.fontSize = `${size}px`;
        }

        setFontSize(size);
    }, [display]);
    
    useEffect(() => {
        console.log(`${left} ${mode ? mode : ""} ${right ? right : ""}`);
        return;
    }, [left, mode, right]);

    return (
        <div className="calc">
            <span>{mode}</span><br />
            <div
                ref={displayRef}
                className="result"
                style={{ fontSize }}
            >
                {display}
            </div>

            <div className="backSpace">
                <input
                    type="button"
                    value={"+/-"}
                    className="ctrlBtn"
                    style={{ backgroundColor: "rgb(56, 56, 56)", height: "30px" }}
                    onClick={() => handleKey("+/-")}
                />
                <input
                    type="button"
                    value={"BS"}
                    className="ctrlBtn"
                    style={{ backgroundColor: "rgb(56, 56, 56)", height: "30px" }}
                    onClick={() => handleKey("BS")}
                />
            </div>
            {keys.map((row, i) => (
                <div className={i == 0 ? "buttons-5" : "buttons-4"} key={i}>
                    {row.map((key) => (
                        <div key={key}>
                            {i == 0 ? (
                                <input
                                    type="button"
                                    value={key}
                                    className="ctrlBtn"
                                    style={{ backgroundColor: key == "AC" ? "rgb(188, 0, 0)" : "rgb(0, 0, 199)" }}
                                    onClick={() => handleKey(key)}
                                />
                            ) : (
                                <input
                                    type="button"
                                    value={key}
                                    className="btn"
                                    onClick={() => handleKey(key)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Calc;