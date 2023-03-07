import React, { useState } from 'react';

// Add <Counter /> to App to use

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: '40px' }}>{count}</span>
      <button
        type="button"
        className="btn btn-large"
        onClick={() => setCount((c) => c + 1)}
      >
        +1
      </button>
    </div>
  );
}

export default Counter;
