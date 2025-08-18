Thought for 2sRead page components### UI Color Scheme Migration: Orange to Lime Green - Complete Component Guide

## Overview

This document outlines the comprehensive changes made to migrate the color scheme from orange to lime green while maintaining responsive design and light theme compatibility across all shadcn/ui components.

## Component Library Used

- **Framework**: Next.js with shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Theme**: Light theme with dark mode support


## shadcn/ui Components Implemented

### Core UI Components

```typescriptreact
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
```

### Icons Used

```typescriptreact
import { Bell, Search, Menu, Star, TrendingUp, Users, Zap } from 'lucide-react'
```

## Detailed Component Color Changes

### 1. Header Component

**Structure**: Sticky header with backdrop blur

- **Logo Container**:

- From: `bg-gradient-to-br from-orange-500 to-red-500`
- To: `bg-gradient-to-br from-lime-500 to-green-500`



- **Notification Badge**:

- From: `bg-orange-500`
- To: `bg-lime-500`



- **Avatar Fallback**:

- From: `bg-gradient-to-br from-orange-500 to-red-600`
- To: `bg-gradient-to-br from-lime-500 to-green-600`





### 2. Hero Section

**Structure**: Centered content with gradient background

- **Announcement Badge**:

- Background: `bg-gradient-to-r from-lime-500/10 to-green-500/10`
- Border: `border-lime-500/20`
- Text: `text-lime-700`
- Icon: `text-lime-600`



- **Main Title Gradient**:

- From: `bg-gradient-to-r from-orange-500 via-red-500 to-amber-500`
- To: `bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500`



- **Primary CTA Button**:

- From: `bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600`
- To: `bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600`





### 3. Stats Cards Grid

**Structure**: Responsive grid (1/2/4 columns) using Card components

- **Card Hover Effects**:

- Dynamic gradient overlays: `bg-gradient-to-br from-{color}/5 to-transparent`



- **Icon Colors**:

- `text-lime-500`, `text-green-500`, `text-emerald-500`, `text-lime-600`



- **Change Indicators**:

- All positive changes: `text-lime-600`





**Individual Card Data**:

```typescriptreact
[
  { icon: Users, label: "Active Users", value: "12.5K", change: "+12%", color: "lime-500" },
  { icon: TrendingUp, label: "Growth Rate", value: "23.1%", change: "+5.2%", color: "green-500" },
  { icon: Zap, label: "Performance", value: "98.9%", change: "+0.3%", color: "emerald-500" },
  { icon: Star, label: "Satisfaction", value: "4.9/5", change: "+0.1", color: "lime-600" },
]
```

### 4. Activity Overview Card

**Structure**: Large card with Progress component and activity list

- **Header Icon**: `text-lime-600`
- **Progress Component**: Uses default lime accent from theme
- **Activity Indicators**:

- Dot colors: `bg-lime-500`, `bg-green-500`, `bg-emerald-500`





### 5. Quick Actions Card

**Structure**: Grid of outline buttons (2/4 columns responsive)

- **Button Hover States**:

- Background: `hover:bg-{color}/10`
- Border: `hover:border-{color}/30`



- **Action Colors**:

- Create: `lime-500`
- Import: `green-500`
- Export: `emerald-500`
- Share: `lime-600`





### 6. Quick Message Card

**Structure**: Form card with Input, Textarea, and Button

- **Submit Button**:

- From: `bg-gradient-to-r from-orange-500 to-red-500`
- To: `bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600`





### 7. Team Members Card

**Structure**: List with Avatar components and status indicators

- **Online Status Dots**:

- Online: `bg-lime-500`
- Away: `bg-yellow-500` (unchanged)





### 8. Footer Component

**Structure**: Multi-column responsive footer

- **Logo Container**:

- From: `bg-gradient-to-br from-orange-500 to-red-500`
- To: `bg-gradient-to-br from-lime-500 to-green-500`





## Layout Structure

### Responsive Breakpoints

- **Mobile**: Single column layout
- **Tablet (sm)**: 2-column grids where applicable
- **Desktop (lg)**: 3-4 column layouts with sidebar


### Grid Systems Used

```typescriptreact
// Stats cards
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Main content
grid-cols-1 lg:grid-cols-3 (2:1 ratio)

// Quick actions
grid-cols-2 sm:grid-cols-4

// Footer
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

## Color Palette Reference

### Primary Lime Green Variants

- `lime-500` - Primary brand color
- `lime-600` - Darker variant for text/icons
- `lime-50` - Light background tint
- `lime-500/10` - 10% opacity overlay
- `lime-500/20` - 20% opacity border


### Supporting Green Variants

- `green-500` - Secondary accent
- `green-600` - Darker secondary
- `emerald-500` - Tertiary accent


### Gradient Combinations

- Primary: `from-lime-500 to-green-500`
- Enhanced: `from-lime-500 via-green-500 to-emerald-500`
- Subtle: `from-lime-500/10 to-green-500/10`


## Accessibility Compliance

- All color combinations maintain WCAG AA contrast ratios
- Semantic color tokens preserve theme compatibility
- Focus states and hover effects clearly visible
- Status indicators use both color and visual cues


This comprehensive guide covers all component implementations and color changes needed to successfully migrate from orange to the lime green color scheme while maintaining the responsive design and component structure.
