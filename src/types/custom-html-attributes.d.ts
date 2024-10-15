// src/types/custom-html-attributes.d.ts
declare namespace astroHTML.JSX {
  interface IntrinsicElements {
    body: HTMLAttributes<HTMLBodyElement> & { nojs?: boolean }
  }
}
