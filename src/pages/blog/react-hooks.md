---
layout: ../../layouts/BlogPost.astro
ref_id: blog-react-hooks
title: "React Hooks: Guía Básica de useState y useEffect"
date: "2026-01-10"
description: "Aprende los fundamentos de los Hooks en React. useState para el estado y useEffect para los efectos secundarios, explicados con ejemplos simples."
tags: ["react", "javascript", "frontend", "hooks"]
---

Desde la versión 16.8, React introdujo los **Hooks**, cambiando para siempre la forma en que escribimos componentes. Ya no necesitamos clases para tener estado o ciclo de vida.

## useState: Manejando la memoria del componente

`useState` es el Hook que permite a un componente "recordar" información.

```jsx
import { useState } from 'react';

function Contador() {
  // [estadoActual, funcionParaActualizar]
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Hiciste clic {count} veces
    </button>
  );
}
```

### Reglas de oro:
1.  Solo llámalos en el nivel superior (no dentro de loops o ifs).
2.  Solo llámalos desde componentes funcionales de React.

## useEffect: Sincronizando con sistemas externos

`useEffect` sirve para manejar "efectos secundarios": llamadas a APIs, suscripciones, timers o manipular el DOM manualmente.

```jsx
import { useState, useEffect } from 'react';

function Reloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    // Esto se ejecuta al montar
    const timer = setInterval(() => setHora(new Date()), 1000);

    // Función de limpieza (se ejecuta al desmontar)
    return () => clearInterval(timer);
  }, []); // [] significa "ejecutar solo una vez al inicio"

  return <h2>Son las: {hora.toLocaleTimeString()}</h2>;
}
```

## Array de dependencias

El segundo argumento de `useEffect` es crucial:
*   `[]`: Se ejecuta solo al montar (como `componentDidMount`).
*   `[propiedad]`: Se ejecuta al montar Y cuando `propiedad` cambia.
*   *(Sin argumento)*: Se ejecuta en CADA renderizado (¡Cuidado!).

Dominar estos dos hooks es el 90% del trabajo en React moderno. ¡Practica con ellos antes de saltar a hooks más complejos como `useContext` o `useReducer`!
