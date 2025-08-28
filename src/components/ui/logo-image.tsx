'use client'

import { useState } from 'react'

interface LogoImageProps {
  src: string
  fallbackSrc: string
  alt: string
  className?: string
}

export function LogoImage({ src, fallbackSrc, alt, className }: LogoImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img 
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}