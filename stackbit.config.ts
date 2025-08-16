import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
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
          urlPath: "/{slug}",
          fields: [
            { name: "title", type: "string", label: "Page Title", required: true },
            { name: "layout", type: "string", label: "Layout" },
            { name: "bannerHeading", type: "string", label: "Banner Heading" },
            { name: "bannerSubheading", type: "string", label: "Banner Subheading" }
          ]
        }
      ]
    })
  ]
});
