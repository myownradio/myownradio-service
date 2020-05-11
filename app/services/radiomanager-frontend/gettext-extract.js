const { GettextExtractor, JsExtractors } = require("gettext-extractor")

const outputPotFile = "./messages.pot"

const extractor = new GettextExtractor()

extractor
  .createJsParser([
    JsExtractors.callExpression("getText", {
      arguments: {
        text: 0,
        context: 1,
      },
    }),
    JsExtractors.callExpression("getPlural", {
      arguments: {
        text: 1,
        textPlural: 2,
        context: 3,
      },
    }),
  ])
  .parseFilesGlob("./src/**/*.@(ts|js|tsx|jsx)")

extractor.savePotFile(outputPotFile)

extractor.printStats()
