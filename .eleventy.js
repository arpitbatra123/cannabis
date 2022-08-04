const markdownLazyLoadImages = require("markdown-it-image-lazy-loading"),
  markdownIt = require("markdown-it"),
  markdownAttrs = require("markdown-it-attrs");

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
      linkify: false,
      typographer: true,
    },
    markdownEngine = markdownIt(options);

  markdownEngine.use(markdownLazyLoadImages);
  markdownEngine.use(markdownAttrs);

  eleventyConfig.setLibrary("md", markdownEngine);

  // For extra config options
  // return {
  // }

  // Receives tagged collection
  eleventyConfig.addFilter(
    "englishPostsOnly",
    function filterTagList(collection) {
      return collection.filter((post) => {
        return post.data.tags.includes("postsEnglish");
      });
    }
  );

  eleventyConfig.addFilter(
    "italianPostsOnly",
    function filterTagList(collection) {
      return collection.filter((post) => {
        return post.data.tags.includes("posts");
      });
    }
  );

  eleventyConfig.addFilter("removeDefaultTags", function filterTagList(tags) {
    return tags.filter((tag) => {
      return !["postsEnglish", "posts"].includes(tag);
    });
  });
};
