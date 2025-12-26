export function getReadingTime(text: string): string {
    if (!text) return 'Quick read';
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes <= 0 ? 'Quick read' : `${minutes} min read`;
}

export function decodeHTMLEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

export function isReadable(content: string): boolean {
    if (!content) return false;
    const lower = content.toLowerCase();

    // If it contains common "Read more" patterns or snippets
    if (lower.includes('read more') || lower.includes('...')) {
        // Only mark as readable if there's actually a substantial amount of text before the jump
        if (content.length < 1200) return false;
    }

    // Heuristic: if it's more than 800 characters or contains multiple paragraph tags
    const paragraphs = (content.match(/<p>/g) || []).length;
    return content.length > 800 || paragraphs >= 2;
}
