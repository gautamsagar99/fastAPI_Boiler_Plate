// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log(
    'Congratulations, your extension "createFastApiBoilerPlateCode" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "fastapiboilerplate.createFastApiBoilerPlateCode",
    function () {
      if (
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
      ) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
          const workspaceDirectory = workspaceFolders[0].uri.fsPath;
          console.log(workspaceDirectory);

          const filePath = workspaceDirectory;

          const pythonFilePathCheck = workspaceDirectory + "/app.py";

          if (fs.existsSync(pythonFilePathCheck)) {
            vscode.window
              .showQuickPick(["Yes", "No"], {
                placeHolder:
                  "The file 'app.py' already exists. Do you want to overwrite it?",
              })
              .then((selection) => {
                if (selection === "Yes") {
                  createPythonFile(filePath);
                } else {
                  vscode.window.showInformationMessage("Operation cancelled.");
                }
              });
          } else {
            createPythonFile(filePath);
          }
        }
      } else {
        vscode.window.showErrorMessage("No workspace folders found.");
      }
    }
  );

  function createPythonFile(filePath) {
    const pythonFilePath = filePath + "/app.py";
    const pythonCode = `
from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
	return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
	return {"item_id": item_id, "q": q}
`;

    fs.writeFile(pythonFilePath, pythonCode, (err) => {
      if (err) {
        console.error(err);
        return vscode.window.showErrorMessage(
          "Failed to create a Fast api boilerplate file."
        );
      } else {
        return vscode.window.showInformationMessage(
          "Created a Fast api boilerplate file."
        );
      }
    });
  }

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
