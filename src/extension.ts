import {ExtensionContext, commands} from 'vscode';

import {SnippetMaker} from './snippet-maker';

export const activate = (context: ExtensionContext) => {
  let disposable = commands.registerCommand('snippetmaker.make_snippet', async () => {
    let snippetMaker = new SnippetMaker();
    await snippetMaker.createSnippet();
  });

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
