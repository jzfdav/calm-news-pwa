export interface Article {
    id: string;
    title: string;
    link: string;
    content: string;
    pubDate: string;
    source: string;
    author?: string;
    thumbnail?: string;
}

export interface Section {
    id: string;
    name: string;
    rssUrl: string;
    articles: Article[];
    lastUpdated?: string;
}

export interface DailyDigest {
    date: string;
    sections: Section[];
}
