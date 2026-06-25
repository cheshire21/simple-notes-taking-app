# References for Auth API & Hooks

## frontend/lib/api.ts

- **Relevance:** Axios instance all feature API calls must use
- **Key patterns:** Import as `import api from "@/lib/api"`, call `api.post(...)`, `api.get(...)`

## frontend/lib/query-client.ts

- **Relevance:** TanStack Query client setup
- **Key patterns:** Hooks use `useMutation` from `@tanstack/react-query`

## frontend/types/index.ts

- **Relevance:** Shared types — auth types go in `features/auth/types.ts`, not here
