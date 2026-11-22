import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view')
      if (reduceMotion) {
        entry.target.classList.remove('reveal')
      }
    }
  }
}, { threshold: 0.15 })

document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
  revealObserver.observe(el)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
