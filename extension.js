// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let hover = vscode.languages.registerHoverProvider('nsc', {
        provideHover(document, position, token) {
            return {
                contents: ['Hover Content'],
            };
        },
    });

    let autocomplete = vscode.languages.registerCompletionItemProvider('nsc', {
        provideCompletionItems(document, position, token) {
            let res = [];
            
            let f = document.getText().split('\n').slice(0, position.line);

            for (let i = 0; i < f.length; i++) {
                let line = f[i].trim();
                if (line.startsWith('def ')) {
                    let args = line.split(' ').slice(1);

                    let snip_txt = '';
                    for (let i = 1; i < args.length; i++) {
                        snip_txt += ' ${' + i.toString() + ':' + args[i] + '}';
                    }

                    res.push({
                        label: args[0],
                        kind: 2,
                        insertText: new vscode.SnippetString(`${args[0]}${snip_txt}`),
                    });
                }
            }

            return res;
        },
    });

    context.subscriptions.push(hover, autocomplete);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
