# CLAUDE.md - Daily Diary Builder

## Build Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { Button } from "@/components/ui/button"`)
- **Components**: Use function declarations for components (not arrow functions)
- **Types**: TypeScript with relaxed settings (noImplicitAny/strictNullChecks disabled)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Styling**: Tailwind CSS with utility classes, use `cn()` from utils for conditional classes
- **UI Components**: Use shadcn/ui components from the components/ui directory
- **Error Handling**: Use try/catch blocks where appropriate
- **Folder Structure**: Components in src/components, pages in src/pages, hooks in src/hooks

## Stack
- Vite, React, TypeScript
- shadcn/ui, Tailwind CSS
- Radix UI primitives
- React Router for navigation