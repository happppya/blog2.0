import { JSX } from "react";
import ArticleDirectory from "@/components/blog/ArticleDirectory";
import { getCategorizedPosts, getAllPosts } from "@/lib/posts"; // Replace with your actual data fetching utility

/**
 * Main Articles route page. 
 * Server-rendered, passes statically generated or cached data to the client directory.
 *
 * @returns {Promise<JSX.Element>}
 */
export default async function ArticlesPage(): Promise<JSX.Element> {

    const allPosts = await getAllPosts();
    const groupedPosts = await getCategorizedPosts(["Next.js", "WebGL", "TypeScript"], false);

    return (
        <div className="relative w-full min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">

            <ArticleDirectory
                groupedPosts={groupedPosts}
                allPosts={allPosts}
            />
        </div>
    );
}