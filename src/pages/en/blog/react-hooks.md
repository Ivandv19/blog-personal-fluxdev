---
layout: ../../../layouts/BlogPost.astro
ref_id: blog-react-hooks
title: "React Hooks: Basic Guide to useState and useEffect"
date: "2026-01-10"
description: "Learn the fundamentals of React Hooks. useState for state and useEffect for side effects, explained with simple examples."
tags: ["react", "javascript", "frontend", "hooks"]
---

Since version 16.8, React introduced **Hooks**, forever changing how we write components. We no longer need classes to handle state or lifecycle methods.

## useState: Component Memory

`useState` is the Hook that lets a component "remember" information.

```jsx
import { useState } from 'react';

function Counter() {
  // [currentState, updateFunction]
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}
```

### Golden Rules:
1.  Only call Hooks at the top level (not inside loops or conditions).
2.  Only call Hooks from React function components.

## useEffect: Synchronizing with External Systems

`useEffect` handles "side effects": API calls, subscriptions, timers, or manual DOM manipulation.

```jsx
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Runs on mount
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Cleanup function (runs on unmount)
    return () => clearInterval(timer);
  }, []); // [] means "run only once on mount"

  return <h2>It is: {time.toLocaleTimeString()}</h2>;
}
```

## Dependency Array

The second argument of `useEffect` is crucial:
*   `[]`: Runs only on mount (like `componentDidMount`).
*   `[prop]`: Runs on mount AND when `prop` changes.
*   *(No argument)*: Runs on EVERY render (Careful!).

Mastering these two hooks is 90% of modern React work. Practice with them before jumping into complex hooks like `useContext` or `useReducer`!
