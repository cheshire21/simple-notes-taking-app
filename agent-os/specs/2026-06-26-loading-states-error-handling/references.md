# References for SIM-21

## NoteCard

- **Location:** `components/ui/NoteCard.tsx`
- **Relevance:** Defines the exact shape (h-[246px], border-radius 11px, p-5, flex flex-col) that NoteCardSkeleton must mirror
- **Key patterns:** Uses hexToRgba for background color; skeleton uses a fixed rgba value

## CategoryItem

- **Location:** `features/categories/components/CategoryItem.tsx`
- **Relevance:** Defines the sidebar item shape (w-2.5 h-2.5 rounded-full dot + text-xs label) that the sidebar skeleton must mirror

## useNotes / useCategories

- **Location:** `features/notes/hooks/useNotes.ts`, `features/categories/hooks/useCategories.ts`
- **Relevance:** Both expose `refetch` from useQuery — used to wire up the "Try again" retry buttons in error states
