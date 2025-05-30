import React, { useState } from "react";

function getRandomArray(size, min = 1, max = 20) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function selectionSortSteps(arr, order = "asc") {
    let steps = [];
    let a = arr.slice();
    let n = a.length;
    const compare = order === "asc"
        ? (x, y) => x < y
        : (x, y) => x > y;

    steps.push({ array: a.slice(), current: -1, minIdx: -1, compared: -1, swapped: false });
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push({ array: a.slice(), current: i, minIdx, compared: -1, swapped: false });
        for (let j = i + 1; j < n; j++) {
            steps.push({ array: a.slice(), current: i, minIdx, compared: j, swapped: false });
            if (compare(a[j], a[minIdx])) {
                minIdx = j;
                steps.push({ array: a.slice(), current: i, minIdx, compared: j, swapped: false });
            }
        }
        if (minIdx !== i) {
            [a[i], a[minIdx]] = [a[minIdx], a[i]];
            steps.push({ array: a.slice(), current: i, minIdx, compared: -1, swapped: true });
        }
    }
    steps.push({ array: a.slice(), current: -1, minIdx: -1, compared: -1, swapped: false });
    return steps;
}

export default function SelectionSortVisualizer() {
    const [arraySize, setArraySize] = useState(5);
    const [array, setArray] = useState(getRandomArray(5));
    const [order, setOrder] = useState("asc");
    const [steps, setSteps] = useState(selectionSortSteps(array, order));
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    React.useEffect(() => {
        setSteps(selectionSortSteps(array, order));
        setStep(0);
    }, [array, order]);

    const handleArraySizeChange = (e) => {
        const size = Math.max(2, Math.min(15, Number(e.target.value)));
        setArraySize(size);
        setArray(getRandomArray(size));
    };

    const handleRandomize = () => {
        setArray(getRandomArray(arraySize));
    };

    const handleOrderChange = (e) => {
        setOrder(e.target.value);
    };

    const handleAutoPlay = async () => {
        setIsAnimating(true);
        for (let i = step + 1; i < steps.length; i++) {
            await new Promise((res) => setTimeout(res, 500));
            setStep(i);
        }
        setIsAnimating(false);
    };

    const current = steps[step];

    return (
        <div className="visualizer-fullscreen">
            <div className="visualizer-title">Selection Sort</div>
            <div className="visualizer-desc">
                Selection Sort divides the array into a sorted and unsorted part, repeatedly selecting the minimum (or maximum) element from the unsorted part and moving it to the sorted part.
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
                    Order:&nbsp;
                    <select
                        value={order}
                        onChange={handleOrderChange}
                        disabled={isAnimating}
                        style={{
                            borderRadius: 4,
                            border: "1px solid #bfc0c0",
                            padding: "4px 8px",
                            fontSize: "1rem"
                        }}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
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
                    if (idx === current.current) color = "#ffb703";
                    if (idx === current.minIdx) color = "#fb8500";
                    if (idx === current.compared) color = "#219ebc";
                    if (step === steps.length - 1) color = "#8bc34a";
                    return (
                        <div
                            key={idx}
                            className="visualizer-bar"
                            style={{
                                height: num * 18 + 20,
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
                <h4 style={{ color: "#4a4e69", marginTop: 32, marginBottom: 8 }}>Selection Sort (JavaScript)</h4>
                <pre className="visualizer-code">
{`function selectionSort(arr, order = "asc") {
  const compare = order === "asc"
    ? (x, y) => x < y
    : (x, y) => x > y;
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (compare(arr[j], arr[minIdx])) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`}
        </pre>
            </div>
        </div>
    );
}