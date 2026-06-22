import { useState, useEffect, useRef } from "react";
import "./style.css"

const Calc = () => {
    const [ result, setResult ] = useState(0);

    const keys = [
        ["7", "8", "9", "/"],
        ["4", "5", "6", "*"],
        ["1", "2", "3", "-"],
        ["0", ".", "=", "+"]
    ];

    return (
        <div className="calc">
            <input type="number" value={result} className="result" readOnly />

            {keys.map((row, i) => (
                <div className="buttons" key={i}>
                    {row.map((key) => (
                        <input
                            key={key}
                            type="button"
                            value={key}
                            className="btn"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Calc;