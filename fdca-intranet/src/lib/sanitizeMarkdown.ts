import DOMPurify from 'dompurify';

export function sanitizeMarkdown(markdown: string): string {
    const cleanMarkdown = DOMPurify.sanitize(markdown);

    //    const cleanMarkdown = markdown;

    return cleanMarkdown;
}