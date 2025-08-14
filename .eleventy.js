module.exports = function (eleventyConfig) {
  // Tell Eleventy to copy the entire 'src/assets' folder as-is to '_site/assets'
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "layouts"
    }
  };
};
