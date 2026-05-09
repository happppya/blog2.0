
export type ArticleImportance =
    | 'Legendary'
    | 'Featured'
    | 'Regular';

export interface Skill {
    name: string;
    category: 'Frontend' | 'Backend' | 'Graphics';
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link: string;
}

export interface PostMeta {
    slug: string;
    title: string;
    excerpt: string;
    importance: ArticleImportance;
    tags: string[];
    date: string;
    excludeFromFeatured: boolean;
}