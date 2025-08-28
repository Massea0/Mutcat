"use client"

import React from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { NewsSection } from '@/components/home/news-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { ServicesSection } from '@/components/home/services-section'
import { QuickLinksSection } from '@/components/home/quick-links-section'
import { StatsSection } from '@/components/home/stats-section'
import { PartnersSection } from '@/components/home/partners-section'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <NewsSection />
      <ProjectsSection />
      <ServicesSection />
      <QuickLinksSection />
      <PartnersSection />
      <ChatbotWidget />
    </>
  )
}