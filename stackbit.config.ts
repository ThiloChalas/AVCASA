import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";
import fs from "fs";
import path from "path";

const contentDir = path.join(__dirname, "src");

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
      const urlPath = isHomePage ? "/" : `/${document.slug}`;
      return {
        stableId: document.id,
        urlPath,
        document,
        isHomePage
      } satisfies SiteMapEntry;
    });
  }
});
