# Next.js Project Development Standards

> This document defines the architectural standards, code conventions, and best practices for developing web applications using Next.js.
>
> **Important**: Please read this document carefully before starting to write code and strictly follow these standards.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [File Structure Standards](#file-structure-standards)
4. [Path Alias Configuration](#path-alias-configuration)
5. [Type Management Standards](#type-management-standards)
6. [better-auth Configuration](#better-auth-configuration)
7. [Routing Architecture Standards](#routing-architecture-standards)
8. [Component Architecture Standards](#component-architecture-standards)
9. [State Management Standards](#state-management-standards)
10. [Data Fetching Standards](#data-fetching-standards)
11. [Code Standards](#code-standards)
12. [Performance Optimization Standards](#performance-optimization-standards)
13. [Naming Conventions](#naming-conventions)

---

## Project Overview

### Project Type

Web Application (supports SSR, SSG, ISR)

### Development Framework

- **Next.js** - React full-stack framework
- **React** - UI library
- **pnpm** - Package manager (recommended, can also use npm/yarn/bun)

### Architecture Principles

1. **Colocation Principle**: Components and hooks should be placed within the pages that use them first
2. **Lift When Needed**: Only lift to global when a second page needs it
3. **Unified Abstraction**: All API calls must be encapsulated as hooks, with location determined by usage scope
4. **Avoid Premature Abstraction**: Don't create generic components early for "potential reuse"
5. **Type Safety**: Use TypeScript to ensure type safety
6. **Type Colocation**: Type definitions should be placed together with implementation
7. **Use type over interface**: All type definitions should use `type`, not `interface`
8. **Integrate External APIs into oRPC**: All external API calls are managed uniformly through the oRPC layer

---

## Tech Stack

### Core Technologies

| Technology     | Version | Purpose                    |
| -------------- | ------- | -------------------------- |
| **Next.js**    | 15+     | React full-stack framework |
| **React**      | 19+     | UI library                 |
| **TypeScript** | 5.0+    | Type system (strict mode)  |

### State Management

| Technology                       | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| **Zustand**                      | Global state management (client-side state)      |
| **TanStack Query (React Query)** | Server state management (data fetching, caching) |

### UI and Styling

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| **shadcn/ui**     | UI component library         |
| **Tailwind CSS**  | CSS framework                |
| **Framer Motion** | Animation library            |
| **next/image**    | Image optimization component |
| **Lucide React**  | Icon library                 |

### Data Persistence

| Technology       | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| **localStorage** | Client-side simple key-value storage (theme, user preferences, etc.) |
| **Redis**        | Server-side caching, session management, queues (optional)           |

### Network Requests

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| **oRPC**           | End-to-end type-safe RPC framework   |
| **TanStack Query** | Request caching and state management |

### Type Validation

| Technology | Purpose                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| **Zod**    | Type-safe runtime validation (forms, environment variables, APIs, etc.) |

### Form Handling

| Technology          | Purpose               |
| ------------------- | --------------------- |
| **React Hook Form** | Form state management |

### Utility Libraries

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| **date-fns**  | Date handling (lightweight) |
| **clsx / cn** | Class name merging utility  |

### Monitoring and Analytics

| Technology  | Purpose                 |
| ----------- | ----------------------- |
| **Sentry**  | Error monitoring        |
| **PostHog** | User behavior analytics |

### Others

| Technology      | Purpose              |
| --------------- | -------------------- |
| **next-intl**   | Internationalization |
| **better-auth** | Authentication       |
| **next-themes** | Theme switching      |

---

## File Structure Standards

### Architecture

**Applicable Scenarios**: Small to medium projects, smaller team size, relatively simple code organization

**Core Features**:

- `server/` at root directory, server-side code is clearer
- `lib/` stores client-side configuration (oRPC client, TanStack Query)
- `components/` and `hooks/` at root directory, flat structure
- Shorter paths, simpler navigation

**File Naming Practices**:

- **File names**: Use kebab-case (e.g., `post-card.tsx`, `use-auth.ts`)
- **Component names**: Use PascalCase (e.g., `PostCard`, `UserAuth`)
- **Maintain consistency**: File names and component names should correspond (`post-card.tsx` exports `PostCard` component)

### Complete Directory Structure

```
my-nextjs-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (shared by all pages)
│   ├── globals.css
│   │
│   ├── (landing)/               # Landing page route group
│   │   ├── layout.tsx          # Landing layout (nested in root layout)
│   │   ├── page.tsx            # Home page → URL: /
│   │   └── _components/        # Home page-specific components
│   │       ├── hero.tsx
│   │       ├── features.tsx
│   │       └── cta.tsx
│   │
│   ├── (dashboard)/             # Application route group
│   │   ├── layout.tsx          # Dashboard layout (nested in root layout)
│   │   │
│   │   ├── home/
│   │   │   ├── page.tsx       # → URL: /home
│   │   │   ├── _components/   # Page-specific components
│   │   │   └── _hooks/        # Page-specific API hooks
│   │   │
│   │   └── settings/
│   │       ├── page.tsx       # → URL: /settings
│   │       ├── _components/
│   │       └── _hooks/
│   │
│   ├── about/                   # Other pages directly under app/
│   │   ├── page.tsx            # → URL: /about
│   │   └── _components/
│   │
│   ├── pricing/
│   │   ├── page.tsx            # → URL: /pricing
│   │   └── _components/
│   │
│   └── api/
│       ├── auth/
│       │   └── [...all]/
│       │       └── route.ts     # better-auth handler
│       │
│       └── orpc/[...orpc]/
│           └── route.ts         # oRPC handler
│
├── server/                       # oRPC server-side (root directory)
│   ├── orpc.ts                  # oRPC configuration
│   ├── context.ts               # oRPC Context
│   │
│   ├── external-api/            # External API clients
│   │   ├── client.ts           # HTTP client configuration
│   │   └── types.ts            # External API type definitions
│   │
│   └── routers/                 # oRPC routers (calling external APIs)
│       ├── index.ts            # Main router
│       ├── users.ts            # User-related procedures
│       ├── credits.ts          # Credits-related procedures
│       └── subscriptions.ts    # Subscription-related procedures
│
├── components/                   # Global components (used by 2+ pages)
│   ├── ui/                      # Basic UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   │
│   └── common/                  # Common business components
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── loading-spinner.tsx
│
├── hooks/                        # Global API Hooks (used by 2+ pages)
│   ├── use-users.ts             # Lifted from page _hooks/
│   ├── use-posts.ts             # Lifted from page _hooks/
│   ├── use-auth.ts              # Common utility hooks
│   └── use-theme.ts             # Common utility hooks
│
├── providers/                    # React Context Providers
│   ├── query-provider.tsx       # TanStack Query Provider
│   ├── lenis-provider.tsx       # Lenis smooth scroll Provider
│   ├── posthog-provider.tsx     # PostHog analytics Provider
│   └── theme-provider.tsx       # Theme Provider
│
├── lib/                          # Client-side configuration
│   ├── orpc-client.ts           # oRPC client (the only API client)
│   ├── query-client.ts          # TanStack Query configuration
│   ├── query-keys.ts            # Query Keys factory
│   ├── auth.ts                  # better-auth client configuration
│   └── redis.ts                 # Redis client configuration (optional)
│
├── utils/                        # Utility functions
│   ├── cn.ts                    # Class name merging utility
│   ├── format.ts                # Date, number formatting
│   ├── validation.ts            # Zod schemas (form validation)
│   ├── string.ts                # String processing utilities
│   └── array.ts                 # Array processing utilities
│
├── store/                        # Zustand global state
│   ├── sidebar-store.ts         # Sidebar state
│   ├── modal-store.ts           # Modal state
│   └── theme-store.ts           # Theme state (optional)
│
├── constants/                    # Constant definitions
│   ├── index.ts                 # Unified exports
│   ├── app.ts                   # Application configuration constants
│   ├── prompts.ts               # AI Prompt templates
│   └── ui.ts                    # UI-related constants
│
├── types/                        # Global common types
│   └── common.ts
│
├── config/                       # Configuration files
│   └── env.ts
│
├── i18n/                         # Internationalization configuration (optional)
│   ├── request.ts               # next-intl request configuration
│   ├── routing.ts               # Routing configuration
│   └── locales/                 # Translation files
│       ├── en.json
│       └── zh.json
│
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Path Alias Configuration

### TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@app/*": ["app/*"],
      "@server/*": ["server/*"],
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@providers/*": ["providers/*"],
      "@lib/*": ["lib/*"],
      "@utils/*": ["utils/*"],
      "@store/*": ["store/*"],
      "@constants/*": ["constants/*"],
      "@i18n/*": ["i18n/*"]
    }
  }
}
```

### Usage Examples

```tsx
// ✅ Import examples
import { Button } from '@components/ui/button';
import { useUsers } from '@hooks/use-users';
import { orpc } from '@lib/orpc-client';
import { useSidebarStore } from '@store/sidebar-store';
import { formatDate } from '@utils/format';
import { QueryProvider } from '@providers/query-provider';
import { APP_NAME } from '@constants/app';
import type { User } from '@server/routers/users';

// Page-specific code
import { Hero } from '@app/(landing)/_components/hero';
import { HomeBanner } from '@app/(dashboard)/home/_components/home-banner';
import { useHomeFilters } from '@app/(dashboard)/home/_hooks/use-home-filters';
```

---

## Type Management Standards

### Core Principle: Colocation of Types and Implementation

**Important**: Type definitions should be placed in the same file as the code that uses them, not separately in a `types/` folder.

### oRPC Router Type Definitions

**File**: `server/routers/posts.ts`

```tsx
import { z } from 'zod';
import { router, publicProcedure } from '../context';

// ✅ Type definitions in oRPC router file
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  createdAt: z.string(),
  likesCount: z.number(),
});

export const postFiltersSchema = z.object({
  category: z.string().optional(),
  sortBy: z.enum(['latest', 'popular']).optional(),
  page: z.number().optional(),
});

// ✅ Export types (inferred from Zod schema)
export type Post = z.infer<typeof postSchema>;
export type PostFilters = z.infer<typeof postFiltersSchema>;

// ✅ oRPC procedures
export const postsRouter = router({
  list: publicProcedure.input(postFiltersSchema).query(async ({ input }) => {
    // Implementation logic
  }),
});
```

### Component Props Types

```tsx
// ✅ Props type definitions within component file
// components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn('button', variant, size, className)} {...props}>
      {children}
    </button>
  );
};
```

### Store Types

```tsx
// ✅ Store type definitions within store file
// store/sidebar-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarStore = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'sidebar-storage',
    },
  ),
);
```

---

## better-auth Configuration

### Server-side Configuration

**File**: `lib/auth.ts`

```tsx
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### API Route Handler

**File**: `app/api/auth/[...all]/route.ts`

```tsx
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

### Client-side Configuration

**File**: `lib/auth-client.ts`

```tsx
'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
```

### Usage Example

**File**: `app/(dashboard)/profile/page.tsx`

```tsx
'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@components/ui/button';

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Please login first</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
    </div>
  );
}
```

---

## Routing Architecture Standards

### Root Layout Configuration

**File**: `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@providers/query-provider';
import { ThemeProvider } from '@providers/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A modern Next.js application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Route Group Layout

**File**: `app/(dashboard)/layout.tsx`

```tsx
import { Header } from '@components/common/header';
import { Sidebar } from '@components/common/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1'>
        <Header />
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}
```

---

## Component Architecture Standards

### Component Classification Decision Tree

```
When creating a new component, ask yourself:

1. Is this component only used in the current page?
   ├─ Yes → Place in page's _components/
   └─ No → Continue to next step

2. Is this component used by 2+ pages?
   ├─ Yes → Continue to next step
   └─ No → Place in page's _components/

3. Is this component a pure UI component?
   ├─ Yes → Place in components/ui/
   └─ No → Place in components/common/
```

### Component Writing Rules

1. **Use TypeScript** - All components must have type definitions
2. **Use Function Components** - Don't use class components
3. **Export Method** - Use `export const` + arrow function
4. **Client Component Marking** - Add `'use client'` to components that need interactivity

---

## State Management Standards

### Zustand - Client-side State

**File**: `store/modal-store.ts`

```tsx
'use client';

import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  modalType: 'login' | 'signup' | null;
  openModal: (type: 'login' | 'signup') => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (type) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));
```

---

## Data Fetching Standards

### TanStack Query Configuration

**File**: `lib/query-client.ts`

```tsx
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

**File**: `providers/query-provider.tsx`

```tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@lib/query-client';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

### API Hooks Management

All API calls must be encapsulated as hooks:

- **Initial Creation**: Place in page's `_hooks/` folder
- **When Reuse is Needed**: Move to global `hooks/` folder

### API Hooks Location Decision Flow

```
When creating a new API hook, ask yourself:

1. Is this hook only used in the current page?
   ├─ Yes → Place in page's _hooks/
   └─ No → Continue to next step

2. Is this hook used by 2+ pages?
   ├─ Yes → Lift to global hooks/ folder
   └─ No → Place in page's _hooks/ (wait for second usage)
```

### API Hooks Usage Examples

**Scenario 1: Page-specific Hook (Initial Creation)**

```tsx
// ✅ File location: app/(dashboard)/home/_hooks/use-home-posts.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { orpc } from '@lib/orpc-client';

export const useHomePosts = (filters?: { category?: string }) => {
  return useQuery({
    queryKey: ['home-posts', filters],
    queryFn: () => orpc.posts.list(filters),
  });
};
```

**Using in page:**

```tsx
// File location: app/(dashboard)/home/page.tsx
'use client';

import { useHomePosts } from './_hooks/use-home-posts';

export default function HomePage() {
  const { data: posts, isLoading } = useHomePosts({ category: 'tech' });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**Scenario 2: Global Hook (Multi-page Reuse)**

When the `settings` page also needs to use post data, lift the hook to global:

```tsx
// ✅ File location: hooks/use-posts.ts (lifted from app/(dashboard)/home/_hooks/)
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@lib/orpc-client';
import type { PostFilters } from '@server/routers/posts';

// Get post list
export const usePosts = (filters?: PostFilters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => orpc.posts.list(filters),
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => orpc.posts.getById({ id }),
    enabled: !!id,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orpc.posts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

**Using in multiple pages:**

```tsx
// File location: app/(dashboard)/home/page.tsx
import { usePosts } from '@hooks/use-posts';

export default function HomePage() {
  const { data: posts } = usePosts({ category: 'tech' });
  // ...
}
```

```tsx
// File location: app/(dashboard)/settings/page.tsx
import { usePosts } from '@hooks/use-posts';

export default function SettingsPage() {
  const { data: posts } = usePosts({ sortBy: 'latest' });
  // ...
}
```

**Scenario 3: Mutation Hook Example**

```tsx
// File location: app/(dashboard)/profile/_hooks/use-update-profile.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@lib/orpc-client';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orpc.users.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Update failed: ' + error.message);
    },
  });
};
```

---

## Code Standards

### Import Standards

**1. Use absolute paths for imports, not relative paths**

```tsx
// ✅ Correct: Use absolute paths (path aliases)
import { Button } from '@components/ui/button';
import { useUsers } from '@hooks/use-users';
import { orpc } from '@lib/orpc-client';
import { formatDate } from '@utils/format';

// ❌ Wrong: Use relative paths
import { Button } from '../../../components/ui/button';
import { useUsers } from '../../hooks/use-users';
import { orpc } from '../lib/orpc-client';
```

**Why use absolute paths?**

- Clearer: You can see at a glance which directory the file comes from
- Easier to maintain: No need to modify import paths when moving files
- Easier to refactor: Less impact when refactoring directory structure
- Avoid errors: Won't fail imports due to wrong number of `../` levels

**2. Don't use Barrel Exports, import specific files directly**

```tsx
// ✅ Correct: Import specific files directly
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

// ❌ Wrong: Use barrel export (index.ts)
import { Button } from '@components/ui';
```

**Why not use Barrel Exports?**

- Avoid circular dependency issues
- Reduce bundle size (tree-shaking is more effective)
- Improve build speed
- Import paths are more explicit

### Class Name Merging Utility

**File**: `utils/cn.ts`

```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
```

---

## Performance Optimization Standards

### React 19 + React Compiler

**Important**: This project uses React 19 with React Compiler enabled. Write clean code directly - optimizations are automatic.

**Don't use these** (compiler handles them):

- `React.memo` - automatic component memoization
- `useCallback` - automatic callback caching
- `useMemo` - automatic computation caching
- Dependency arrays - automatic dependency tracking

**Only add manual optimization if profiling shows a real bottleneck.**

---

## Naming Conventions

| Type               | Naming Rule | Example                                                         |
| ------------------ | ----------- | --------------------------------------------------------------- |
| **Files**          | kebab-case  | `post-card.tsx`, `use-auth.ts`                                  |
| **Components**     | PascalCase  | `PostCard`, `UserAvatar`                                        |
| **Hook Files**     | kebab-case  | `use-auth.ts`, `use-debounce.ts`                                |
| **Hook Functions** | camelCase   | `useAuth`, `useDebounce` (file `use-auth.ts` exports `useAuth`) |
| **Constants**      | UPPER_CASE  | `API_BASE_URL`, `MAX_RETRY_COUNT`                               |

---

## Summary

### Core Principles

1. **Colocation Principle** - Components and hooks should be placed within pages first
2. **Lift When Needed** - Only lift to global on second usage
3. **Unified Abstraction** - All API calls must be encapsulated as hooks
4. **Type Colocation** - Type definitions and implementation together
5. **All Absolute Paths** - Use path aliases

### Standards That Must Be Followed

- ✅ Use folder routing (`page.tsx`)
- ✅ All API calls are encapsulated as hooks
- ✅ Use `type` instead of `interface`
- ✅ Use `export const` to export components
- ✅ Don't use Barrel Exports
- ✅ better-auth handles authentication (no need for auth-store)
- ✅ Zustand uses multiple small, focused stores
