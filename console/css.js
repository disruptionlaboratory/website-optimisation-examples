const { program } = require("commander");
const CleanCSS = require("clean-css");
const fs = require("fs");

program.version("0.0.0").description("Compress main.css file");

program
  .command("compress")
  .description("Compress CSS file")
  .action(async () => {
    const inputFilePath = "./public/css/main.css";
    const outputFilePath = "./public/css/main.min.css";

    const minifier = new CleanCSS({
      level: {
        1: {
          removeComments: true,
          removeWhitespace: true,
        },
        2: {
          mergeRules: true,
          advanced: true,
        },
      },
    });

    try {
      const cssContent = fs.readFileSync(inputFilePath, "utf8");
      const minifiedCss = minifier.minify(cssContent);

      // console.log(minifiedCss);
      //
      // if (minifiedCss.errors) {
      //   console.error("CSS Minification Errors:", minifiedCss.errors);
      //   process.exit(1); // Exit with an error code
      // }

      fs.writeFileSync(outputFilePath, minifiedCss.styles);
      console.log(`CSS minified and saved to ${outputFilePath}`);
    } catch (error) {
      console.error("Error during CSS minification:", error);
      process.exit(1); // Exit with an error code
    }
  });

program.parse();
