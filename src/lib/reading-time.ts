export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  // Clean markdown and HTML tags
  const cleanText = content
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_`~[\]()!-]/g, "")
    .trim();
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);
  return minutes > 0 ? minutes : 1;
}
