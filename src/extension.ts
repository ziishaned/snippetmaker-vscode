import {
  ExtensionContext,
  commands,
  TextEditor,
  window,
  languages,
  Selection
} from "vscode";

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

      console.log(snippetInfo);
    }
  );

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
