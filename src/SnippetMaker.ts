import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { TextEditor, window, languages, Selection } from "vscode";

import { getVSCodeUserPath } from "./helpers";

const readFileSync = promisify(readFile);
const writeFileSync = promisify(writeFile);

interface SnippetInfoInterface {
  lang: string;
  name: string;
  body: Array<string>;
  prefix: string;
  description: string;
}

export class SnippetMaker {
  private editor: TextEditor;
  private snippetInfo: SnippetInfoInterface;

  public constructor() {
    this.snippetInfo = <SnippetInfoInterface>{};
    this.editor = <TextEditor>window.activeTextEditor;
  }

  public createSnippet = async () => {
    this.setSnippetInfo();

    let snippetsPath = this.getSnippetsPath();
    let snippetFilePath = `${snippetsPath}/${this.snippetInfo.lang}.json`;

    let text = "{}";
    try {
      text = await readFileSync(snippetFilePath, {
        encoding: "utf8"
      });
    } catch (e) {
      if (e.code !== "ENOENT") {
        window.showErrorMessage(
          "Something went wrong while retrieving snippets."
        );
        return;
      }

      await writeFileSync(snippetFilePath, "{}");
    }

    let snippetFileText = JSON.parse(text);
    snippetFileText[this.snippetInfo.name] = {
      body: this.snippetInfo.body,
      prefix: this.snippetInfo.prefix,
      description: this.snippetInfo.description
    };

    await writeFileSync(snippetFilePath, JSON.stringify(snippetFileText));
  }

  /**
   * Get snippet information from user.
   *
   * @returns void
   */
  private setSnippetInfo = async (): Promise<void> => {
    let snippetBody = this.selectedText();

    this.snippetInfo.body = snippetBody.split("\n");

    let listOfLanguages = await languages.getLanguages();
    this.snippetInfo.lang = <string>await window.showQuickPick(
      listOfLanguages,
      {
        placeHolder: this.editor.document.languageId
      }
    );

    this.snippetInfo.name = <string>await window.showInputBox({
      prompt: "Name"
    });

    this.snippetInfo.prefix = <string>await window.showInputBox({
      prompt: "Trigger"
    });

    this.snippetInfo.description = <string>await window.showInputBox({
      prompt: "Description"
    });
  }

  /**
   * Get the user defined snippets path.
   *
   * @returns string
   */
  private getSnippetsPath = (): string => {
    let vscodeUserPath = getVSCodeUserPath();

    return `${vscodeUserPath}/snippets`;
  }

  /**
   * Get selected text from active editor.
   *
   * @returns string
   */
  private selectedText = (): string => {
    let selectedRegion = <Selection>this.editor.selection;

    return this.editor.document.getText(selectedRegion);
  }
}
