const markdownLazyLoadImages = require("markdown-it-image-lazy-loading"),
    markdownIt = require("markdown-it"),
    markdownAttrs = require("markdown-it-attrs"),
    markdownItAnchor = require("markdown-it-anchor"),
    eleventyNavigationPlugin = require("@11ty/eleventy-navigation"),
    eleventyPluginTOC = require("eleventy-plugin-toc"),
    slugify = require("slugify"),
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
        (collection, currentTags, currentUrl) => {
            let pagesWithCommonTags = collection.filter((page) => {
                if (page.url == currentUrl) {
                    return false;
                }

                const first = page.data.tags,
                    second = currentTags,
                    common = first.filter((x) => second.includes(x));
                return common.length > 1;
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

    // create blog collection
    eleventyConfig.addCollection("blogposts", function (collection) {
        return collection.getFilteredByGlob("./posts/*.md").reverse();
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
