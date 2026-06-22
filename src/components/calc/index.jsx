import { useState, useEffect, useRef } from "react";
import "./style.css"

const Calc = () => {
    const [ result, setResult ] = useState(0);

    return (
        <div className="calc">
            <input type="number" value={result} className="result" readOnly /><br />
            <button className="btn">7</button><button className="btn">8</button><button className="btn">9</button><br />
            <button className="btn">4</button><button className="btn">5</button><button className="btn">6</button><br />
            <button className="btn">1</button><button className="btn">2</button><button className="btn">3</button><br />
            <button className="btn">0</button><button className="btn">.</button><button className="btn">=</button>
        </div>
    );
}

export default Calc;