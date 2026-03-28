const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const CUSTOM_CSS_EXT = "be5invis.vscode-custom-css";

function activate(context) {
  // 1. Welcome message
  vscode.window.showInformationMessage("Sushanto Dark loaded.");

  // 2. Apply font settings
  applyFontSettings();

  // 3. Inject CSS
  injectCustomCSS(context);
}

async function applyFontSettings() {
  const config = vscode.workspace.getConfiguration("editor");
  // await config.update(
  //   "fontFamily",
  //   "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
  //   vscode.ConfigurationTarget.Global
  // );
  await config.update("fontLigatures", true, vscode.ConfigurationTarget.Global);
}

async function injectCustomCSS(context) {
  const cssFilePath = path.join(context.extensionPath, "css", "my-vscode-bg.css");

  if (!fs.existsSync(cssFilePath)) {
    vscode.window.showWarningMessage(`Sushanto Dark: CSS file not found.`);
    return;
  }

  const customCSSExt = vscode.extensions.getExtension(CUSTOM_CSS_EXT);

  if (!customCSSExt) {
    vscode.window
      .showWarningMessage(
        `Sushanto Dark: Install "Custom CSS and JS Loader" to enable background styles.`,
        "Install Now"
      )
      .then((action) => {
        if (action === "Install Now") {
          vscode.commands.executeCommand(
            "workbench.extensions.installExtension",
            CUSTOM_CSS_EXT
          );
        }
      });
    return;
  }

  const cssConfig = vscode.workspace.getConfiguration("vscode_custom_css");
  const currentImports = cssConfig.get("imports") || [];
  const cssUri = vscode.Uri.file(cssFilePath).toString();

  if (!currentImports.includes(cssUri)) {
    await cssConfig.update(
      "imports",
      [...currentImports, cssUri],
      vscode.ConfigurationTarget.Global
    );

    vscode.window
      .showInformationMessage(
        `Sushanto Dark: CSS registered. Reload to apply.`,
        "Reload Now"
      )
      .then((action) => {
        if (action === "Reload Now") {
          vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
      });
  }
}

function deactivate() {}

module.exports = { activate, deactivate };