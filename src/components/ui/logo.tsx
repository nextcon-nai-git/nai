
"use client"

import * as React from "react"

export function NextconLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Moldura Quadrada Central */}
      <rect 
        x="28" 
        y="28" 
        width="44" 
        height="44" 
        stroke="currentColor" 
        strokeWidth="5"
        strokeLinejoin="round"
      />
      
      {/* "N" da Esquerda */}
      <path 
        d="M15 75V35L44 75V35" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* "N" da Direita */}
      <path 
        d="M56 65V25L85 65V25" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
