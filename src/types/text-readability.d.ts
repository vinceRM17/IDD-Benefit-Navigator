declare module 'text-readability' {
  interface Readability {
    fleschKincaidGrade(text: string): number;
    colemanLiauIndex(text: string): number;
    fleschReadingEase(text: string): number;
  }

  const readability: Readability;
  export default readability;
}
