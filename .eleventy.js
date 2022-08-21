const markdownLazyLoadImages = require("markdown-it-image-lazy-loading"),
  markdownIt = require("markdown-it"),
  markdownAttrs = require("markdown-it-attrs"),
  markdownItAnchor = require("markdown-it-anchor");
SIMILAR_ARTICLES_LIMIT = 4;

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.setDataDeepMerge(true);

  const options = {
      html: true,
      breaks: true,
      linkify: true,
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

  // For extra config options
  // return {
  // }

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
};
