
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
      {/* Texto: NEXTCON - Estilo Bold Montserrat Style */}
      <text 
        x="0" 
        y="75" 
        fill="currentColor" 
        style={{ font: '900 85px Montserrat, sans-serif', letterSpacing: '-3px' }}
      >
        NEXTCON
      </text>
      
      {/* Texto: Inteligência NAI em SST - Estilo Light/Regular Azul Claro Brilhante */}
      <text 
        x="5" 
        y="108" 
        fill="#00f2ff" 
        style={{ font: '600 24px Montserrat, sans-serif', letterSpacing: '2px', textTransform: 'none', filter: 'drop-shadow(0 0 2px rgba(0,242,255,0.5))' }}
      >
        Inteligência NAI em SST
      </text>
    </svg>
  )
}
