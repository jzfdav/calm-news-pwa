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
