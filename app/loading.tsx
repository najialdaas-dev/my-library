// This file is kept returning null to prevent global page flashes and scroll resets during transitions.
// Individual segment loading files (e.g. books/[slug]/loading.tsx) are used instead.
export default function GlobalLoading() {
  return null
}
