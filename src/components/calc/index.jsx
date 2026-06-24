import { useState, useEffect, useRef } from "react";
import "./style.css";
import Decimal from "decimal.js/decimal.js";

const Calc = ({ onEqualClicked }) => {
    const [ display, setDisplay ] = useState("0");
    const [ left, setLeft ] = useState("0");
    const [ right, setRight ] = useState("0");
    const [ mode, setMode ] = useState(null);
    const [ float, setFloat ] = useState(0);
    const [ mem, setMem ] = useState("0");
    
    const keys = [
        ["AC", "MC", "MR", "M+", "M-"],
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        ["0", ".", "=", "+"]
    ];

    function handleKey(key) {
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
            if(key == "+") {
                result = new Decimal(left).plus(new Decimal(right));
            } else if(key == "-") {
                result = new Decimal(left).minus(new Decimal(right));
            } else if(key == "*") {
                result = new Decimal(left).times(new Decimal(right));
            } else if(key == "/") {
                result = new Decimal(left).div(new Decimal(right));
            }
            setLeft(result);
            setRight("0");
            setDisplay(result);
        }
        setMode(key);
    }

    useEffect(() => {
        console.log(`${left} ${mode ? mode : ""} ${right ? right : ""}`);
        return;
    }, [left, mode, right]);

    return (
        <div className="calc">
            <span>{mode}</span><br />
            <input type="text" value={display} className="result" readOnly />

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