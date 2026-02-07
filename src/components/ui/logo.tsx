"use client"

import * as React from "react"

export function NextconLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 450 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Texto: NEXTCON */}
      <text 
        x="0" 
        y="75" 
        fill="#002d9c" 
        style={{ font: '900 85px Arial, sans-serif', letterSpacing: '-2px' }}
      >
        NEXTCON
      </text>
      
      {/* Texto: saúde empresarial */}
      <text 
        x="5" 
        y="108" 
        fill="#00b4ff" 
        style={{ font: 'bold 28px Arial, sans-serif', letterSpacing: '4px', textTransform: 'lowercase' }}
      >
        saúde empresarial
      </text>
    </svg>
  )
}
