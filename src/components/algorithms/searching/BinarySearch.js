import React, { useState } from "react";

function getRandomSortedArray(size, min = 1, max = 99) {
    const arr = Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
    arr.sort((a, b) => a - b);
    return arr;
}

function binarySearchSteps(arr, target) {
    let steps = [];
    let l = 0, r = arr.length - 1;
    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        steps.push({
            array: arr.slice(),
            l,
            r,
            mid,
            found: arr[mid] === target,
            target
        });
        if (arr[mid] === target) break;
        if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    if (steps.length === 0 || !steps[steps.length - 1].found) {
        steps.push({
            array: arr.slice(),
            l: null,
            r: null,
            mid: null,
            found: false,
            target
        });
    }
    return steps;
}

export default function BinarySearchVisualizer() {
    const [arraySize, setArraySize] = useState(8);
    const [array, setArray] = useState(getRandomSortedArray(8));
    const [target, setTarget] = useState(array[0]);
    const [steps, setSteps] = useState(binarySearchSteps(array, target));
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    React.useEffect(() => {
        setSteps(binarySearchSteps(array, target));
        setStep(0);
    }, [array, target]);

    const handleArraySizeChange = (e) => {
        const size = Math.max(2, Math.min(15, Number(e.target.value)));
        const newArr = getRandomSortedArray(size);
        setArraySize(size);
        setArray(newArr);
        setTarget(newArr[0]);
    };

    const handleRandomize = () => {
        const newArr = getRandomSortedArray(arraySize);
        setArray(newArr);
        setTarget(newArr[0]);
    };

    const handleTargetChange = (e) => {
        setTarget(Number(e.target.value));
    };

    const handleAutoPlay = async () => {
        setIsAnimating(true);
        for (let i = step + 1; i < steps.length; i++) {
            await new Promise((res) => setTimeout(res, 600));
            setStep(i);
        }
        setIsAnimating(false);
    };

    const current = steps[step];

    return (
        <div className="visualizer-fullscreen">
            <div className="visualizer-title">Binary Search</div>
            <div className="visualizer-desc">
                Binary Search works on sorted arrays by repeatedly dividing the search interval in half.
            </div>
            <div style={{ display: "flex", gap: 16, margin: "16px 0", flexWrap: "wrap" }}>
                <div style={{ color: "#ffb703", fontWeight: 500 }}>Yellow: Mid</div>
                <div style={{ color: "#219ebc", fontWeight: 500 }}>Blue: Search Range</div>
                <div style={{ color: "#8bc34a", fontWeight: 500 }}>Green: Found</div>
            </div>
            <div className="visualizer-controls">
                <label>
                    <span style={{ color: "#4a4e69", fontWeight: 500 }}>Array size:</span>&nbsp;
                    <input
                        type="number"
                        min={2}
                        max={15}
                        value={arraySize}
                        onChange={handleArraySizeChange}
                        disabled={isAnimating}
                        style={{
                            width: 50,
                            borderRadius: 4,
                            border: "1px solid #bfc0c0",
                            padding: "4px 8px",
                            fontSize: "1rem"
                        }}
                    />
                </label>
                <button className="visualizer-btn" onClick={handleRandomize} disabled={isAnimating}>
                    Randomize
                </button>
                <label style={{ marginLeft: 16, color: "#4a4e69", fontWeight: 500 }}>
                    Target:&nbsp;
                    <input
                        type="number"
                        value={target}
                        onChange={handleTargetChange}
                        disabled={isAnimating}
                        style={{
                            width: 60,
                            borderRadius: 4,
                            border: "1px solid #bfc0c0",
                            padding: "4px 8px",
                            fontSize: "1rem"
                        }}
                    />
                </label>
                <button
                    className="visualizer-btn"
                    onClick={handleAutoPlay}
                    disabled={isAnimating || step === steps.length - 1}
                >
                    Auto Play
                </button>
            </div>
            <div className="visualizer-array">
                {current.array.map((num, idx) => {
                    let color = "#a3cef1";
                    if (
                        current.l !== null &&
                        current.r !== null &&
                        idx >= current.l &&
                        idx <= current.r
                    )
                        color = "#219ebc";
                    if (idx === current.mid) color = "#ffb703";
                    if (current.found && idx === current.mid) color = "#8bc34a";
                    return (
                        <div
                            key={idx}
                            className="visualizer-bar"
                            style={{
                                height: num * 2 + 20,
                                width: 34,
                                background: color,
                                color: "#22223b",
                                fontSize: "1.1rem"
                            }}
                        >
                            {num}
                        </div>
                    );
                })}
            </div>
            {/* --- Result Message --- */}
            {step === steps.length - 1 && (
                <div style={{
                    margin: "18px 0",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: current.found ? "#388e3c" : "#d32f2f"
                }}>
                    {current.found
                        ? `Found at index ${current.mid}`
                        : "Not found"}
                </div>
            )}
            <div className="visualizer-controls" style={{ justifyContent: "center" }}>
                <button
                    className="visualizer-btn"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0 || isAnimating}
                >
                    Previous
                </button>
                <button
                    className="visualizer-btn"
                    onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                    disabled={step === steps.length - 1 || isAnimating}
                >
                    Next
                </button>
            </div>
            <div>
                <h4 style={{ color: "#4a4e69", marginTop: 32, marginBottom: 8 }}>Binary Search (JavaScript)</h4>
                <pre className="visualizer-code">
{`function binarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}`}
        </pre>
            </div>
        </div>
    );
}