const markdownLazyLoadImages = require("markdown-it-image-lazy-loading"),
    markdownIt = require("markdown-it"),
    markdownAttrs = require("markdown-it-attrs"),
    markdownItAnchor = require("markdown-it-anchor"),
    eleventyNavigationPlugin = require("@11ty/eleventy-navigation"),
    eleventyPluginTOC = require("eleventy-plugin-toc"),
    { getAllKeyValues } = require("./getAllKeyValues");

SIMILAR_ARTICLES_LIMIT = 4;

module.exports = (eleventyConfig) => {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(eleventyPluginTOC);

    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("manifest.json");
    eleventyConfig.addPassthroughCopy("_redirects");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("robots.txt");

    eleventyConfig.setDataDeepMerge(true);

    const options = {
            html: true,
            breaks: true,
            linkify: false,
            typographer: true,
        },
        markdownEngine = markdownIt(options);

    markdownEngine.use(markdownLazyLoadImages);
    markdownEngine.use(markdownAttrs);
    markdownEngine.use(markdownItAnchor, {
        permalink: true,
        permalinkClass: "direct-link",
        permalinkSymbol: "#",
    });

    eleventyConfig.setLibrary("md", markdownEngine);

    // Receives tagged collection
    eleventyConfig.addFilter("englishPostsOnly", function (collection) {
        return collection.filter((post) => {
            return post.data.tags.includes("postsEnglish");
        });
    });

    eleventyConfig.addFilter("italianPostsOnly", function (collection) {
        return collection.filter((post) => {
            return post.data.tags.includes("posts");
        });
    });

    eleventyConfig.addFilter("removeDefaultTags", function (tags) {
        return tags.filter((tag) => {
            return !["postsEnglish", "posts"].includes(tag);
        });
    });

    eleventyConfig.addFilter(
        "filterRelated",
        (collection, currentTags, currentCategories, currentUrl) => {
            let pagesWithCommonTags = collection.filter((page) => {
                if (page.url == currentUrl) {
                    return false;
                }

                const pageTags = page.data.tags,
                    pageCategories = page.data.categories || [],
                    categoriesOfPage = currentCategories || [],
                    commonTags = pageTags.filter((x) =>
                        currentTags.includes(x)
                    ), 
                    commonCategories = pageCategories.filter((x) =>
                        categoriesOfPage.includes(x)
                    );
                return commonTags.length > 1 || commonCategories.length > 0;
            });

            pagesWithCommonTags = pagesWithCommonTags.slice(
                0,
                SIMILAR_ARTICLES_LIMIT
            );
            return pagesWithCommonTags;
        }
    );

    eleventyConfig.addCollection("tagsListGlobal", (collectionApi) => {
        const tagsSet = new Set();
        collectionApi.getAll().forEach((item) => {
            if (!item.data.tags) return;
            item.data.tags.forEach((tag) => tagsSet.add(tag));
        });
        return Array.from(tagsSet).filter((tag) => {
            return !["postsEnglish", "posts"].includes(tag);
        });
    });

    // create blog categories collection
    eleventyConfig.addCollection("blogCategories", function (collection) {
        let allCategories = getAllKeyValues(
            collection.getFilteredByGlob("./posts/*.md"),
            "categories"
        );

        let blogCategories = allCategories.map((category) => ({
            title: category,
        }));

        return blogCategories;
    });

    // filters
    eleventyConfig.addFilter("include", require("./filters/include.js"));
    eleventyConfig.addFilter(
        "getDescription",
        require("./filters/getDescription.js")
    );
    eleventyConfig.addFilter(
        "getDescription",
        require("./filters/getDescription.js")
    );

    // For extra config options
    // return {
    // }
};
