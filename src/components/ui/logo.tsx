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
      
      {/* Texto: Inteligência NAI em SST - Estilo Light/Regular Ciano */}
      <text 
        x="5" 
        y="108" 
        fill="#00b4ff" 
        style={{ font: '500 24px Montserrat, sans-serif', letterSpacing: '2px', textTransform: 'none' }}
      >
        Inteligência NAI em SST
      </text>
    </svg>
  )
}
