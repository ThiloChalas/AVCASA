const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://avcasa.fr"
    }
  });

  // Tell Eleventy to copy the entire 'src/assets' folder as-is to '_site/assets'
  eleventyConfig.addPassthroughCopy("src/assets");
  // Tell Eleventy to copy the 'src/assets/glideandseek' folder as-is to '_site/assets/glideandseek'
  eleventyConfig.addPassthroughCopy("src/assets/glideandseek");
  

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "layouts"
    }
  };
};
