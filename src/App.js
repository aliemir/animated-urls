import React from "react";
import "./styles.css";

const locationHash = (hash) => {
  if (window && window.location) {
    window.location.hash = hash;
  }
};

const pushState = (state) => {
  if (window && window.history) {
    window.history.pushState(undefined, undefined, state);
  }
};

const replaceState = (state) => {
  if (window && window.history) {
    window.history.replaceState(undefined, undefined, state);
  }
};

const animateUrl = (config = {}) => {
  const frames = [];
  let current = 0;
  let interval;

  const { url, ms, onStart, onStop, prefix, suffix, api } = {
    ...{
      url: undefined,
      ms: 300,
      onStart: () => {},
      onStop: () => {},
      prefix: "",
      suffix: "",
      api: replaceState
    },
    ...config
  };

  // url: string[] | string
  if (Array.isArray(url)) {
    frames.push(...url);
  } else if (typeof url === "string") {
    const sequence = url.split("").reduce((prev, curr, i, arr) => {
      return [...prev, arr.slice(0, i + 1).join("")];
    }, []);
    frames.push(...sequence);
  } else {
    return;
  }

  const tick = () => {
    const atEnd = current === frames.length - 1;
    api((atEnd ? "" : prefix) + frames[current] + (atEnd ? "" : suffix));
    current++;
    if (atEnd) {
      onStop();
      clearInterval(interval);
    }
  };

  onStart();
  interval = setInterval(tick, ms);
};

const App = () => {
  const [query, setQuery] = React.useState("query");

  const onAnimateClick = () => {
    animateUrl({
      url: query,
      ms: 100,
      onStop: () => console.log("end"),
      suffix: ""
    });
  };

  const onInputChange = ({ target: { value } = {} }) => {
    setQuery(value ?? "");
  };

  return (
    <div className="App">
      <h4>Animated URLs</h4>
      <input
        type="text"
        placeholder="animated query"
        value={query}
        onChange={onInputChange}
      />
      <button onClick={onAnimateClick}>Animate URL</button>
      <button onClick={() => window.history.back()}>history.back</button>
    </div>
  );
};

export default App;
