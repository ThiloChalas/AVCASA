const { defineStackbitConfig } = require("@stackbit/types");
const { GitContentSource } = require("@stackbit/cms-git");

module.exports = defineStackbitConfig({
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["src"],
      models: [
        {
          name: "page",
          label: "Site Page",
          type: "page",
          filePath: "src/{slug}.njk",
          mediaType: "text/njk",
          urlPath: "/{slug}",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "layout", type: "string" },
            { name: "bannerHeading", type: "string" },
            { name: "bannerSubheading", type: "string" }
          ]
        }
      ]
    })
  ],
  siteMap: ({ documents }) => {
    return documents.map((document) => {
      const isHomePage = document.slug === "index";
      return {
        stableId: document.id,
        urlPath: isHomePage ? "/" : `/${document.slug}`,
        document,
        isHomePage
      };
    });
  }
});
