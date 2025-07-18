# BlogSpace - Full Stack Blog Application

## Overview

BlogSpace is a modern full-stack blog application built with React, TypeScript, and Express.js. It features a clean, responsive design with markdown support, image uploads, and a comprehensive commenting system. The application uses a PostgreSQL database with Drizzle ORM and includes both published and draft post management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with separate client and server directories, sharing common schemas and types. It uses modern web technologies with a focus on type safety and developer experience.

### Directory Structure
- `client/` - React frontend with Vite build system
- `server/` - Express.js backend API
- `shared/` - Common schemas and types shared between client and server
- `migrations/` - Database migration files

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for image uploads
- **Development**: In-memory storage fallback for development
- **API Design**: RESTful API with JSON responses

### Database Schema
- **Posts**: Full blog posts with title, slug, content, excerpt, featured images, tags, and publish status
- **Comments**: Nested comments system with author information
- **Users**: Basic user management (schema defined but not fully implemented)

## Data Flow

1. **Post Creation**: Users create posts with markdown content, optional featured images, and tags
2. **Content Management**: Posts can be saved as drafts or published immediately
3. **Image Handling**: Images are uploaded to local storage and served statically
4. **Comments**: Visitors can leave comments on published posts
5. **Real-time Updates**: TanStack Query handles cache invalidation and optimistic updates

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-zod for type-safe database operations
- **UI Library**: @radix-ui components for accessible UI primitives
- **Query Management**: @tanstack/react-query for server state
- **Form Handling**: react-hook-form with @hookform/resolvers
- **Validation**: zod for schema validation
- **Styling**: tailwindcss with class-variance-authority for component variants

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type checking across the stack
- **Database Management**: drizzle-kit for migrations and schema management
- **File Uploads**: multer for handling multipart form data

## Deployment Strategy

The application is designed for deployment on platforms like Replit, with:

1. **Build Process**: 
   - Frontend builds to `dist/public` directory
   - Backend builds with esbuild to `dist/index.js`
   - Static assets served from Express in production

2. **Database Setup**: 
   - PostgreSQL database required (DATABASE_URL environment variable)
   - Drizzle migrations handle schema management
   - Development fallback uses in-memory storage

3. **Environment Configuration**:
   - Development: Vite dev server with HMR
   - Production: Express serves static files and API routes
   - File uploads stored in local `uploads/` directory

4. **Key Features**:
   - Responsive design works on all device sizes
   - SEO-friendly with proper meta tags and semantic HTML
   - Markdown editor with live preview
   - Image upload and optimization
   - Comment system with moderation capabilities
   - Social sharing functionality

The architecture prioritizes developer experience with hot reloading, type safety, and modern tooling while maintaining good performance and accessibility standards.