"use client"

import * as React from "react"

export function NextconLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Icone: Quadrado Ciano */}
      <rect 
        x="45" 
        y="35" 
        width="50" 
        height="50" 
        stroke="#00b4ff" 
        strokeWidth="4"
      />
      
      {/* Icone: Letras N entrelaçadas em Azul Marinho */}
      <path 
        d="M25 95V25L60 95V25" 
        stroke="#002d9c" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M85 95V25L120 95V25" 
        stroke="#002d9c" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Texto: nextcon */}
      <text 
        x="145" 
        y="75" 
        fill="#002d9c" 
        style={{ font: 'bold 65px Arial, sans-serif' }}
      >
        nextcon
      </text>
      
      {/* Texto: saúde empresarial */}
      <text 
        x="148" 
        y="105" 
        fill="#00b4ff" 
        style={{ font: 'normal 24px Arial, sans-serif', letterSpacing: '2px' }}
      >
        saúde empresarial
      </text>
    </svg>
  )
}
