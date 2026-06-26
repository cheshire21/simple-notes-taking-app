# Standards

## frontend/feature-structure
- features/categories/ mirrors features/auth/ layout
- types.ts, api.ts, hooks/, schemas/, components/ subdirs

## frontend/forms
- react-hook-form + zod mandatory
- setError for API field errors
- isPending disables input during submission

## frontend/code-style
- Arrow functions, double quotes, explicit JSX.Element return types
- No hardcoded hex — but color dots use bg-[#hex] for dynamic Tailwind
