import {
  ExtensionContext,
  commands,
  TextEditor,
  window,
  languages,
  Selection
} from "vscode";
import { readFile, writeFile } from "fs";
import { promisify } from "util";

const readFileSync = promisify(readFile);
const writeFileSync = promisify(writeFile);

interface SnippetInfoInterface {
  lang: string;
  name: string;
  description: string;
}

export const activate = (context: ExtensionContext) => {
  let disposable = commands.registerCommand(
    "snippetmaker.make_snippet",
    async () => {
      let editor = <TextEditor>window.activeTextEditor;
      let selected = <Selection>editor.selection;

      let selectedText = <string>editor.document.getText(selected);

      let listOfLanguages = await languages.getLanguages();

      let snippetInfo = <SnippetInfoInterface>{};
      snippetInfo.lang = <string>await window.showQuickPick(listOfLanguages, {
        placeHolder: editor.document.languageId
      });

      snippetInfo.name = <string>await window.showInputBox({
        prompt: "Trigger"
      });

      snippetInfo.description = <string>await window.showInputBox({
        prompt: "Description"
      });

      let extensionPath = context.extensionPath;

      let snippetFileFile = `${extensionPath}/snippets/${
        snippetInfo.lang
      }.json`;

      let text = "";
      try {
        text = await readFileSync(snippetFileFile, {
          encoding: "utf8"
        });
      } catch (e) {
        if (e.code !== "ENOENT") {
          return;
        }

        await writeFileSync(snippetFileFile, "");
      }
    }
  );

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
