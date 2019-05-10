// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let autocomplete = vscode.languages.registerCompletionItemProvider('nsc', {
        provideCompletionItems(document, position, token) {
            let res = [];

            let f = [];

            let pos = position.line;
            let raw = document.getText().split('\n');
            let depth = 0;

            while (pos >= 0) {
                let line = raw[pos].trim();

                let words = line.split(' ');

                if (words[0] === 'end' || words[0] === 'endif') depth += 1;

                if (words[0] === 'def') {
                    depth -= 1;

                    if (depth <= 0) {
                        let snip_txt = '';
                        for (let i = 2; i < words.length; i++) {
                            snip_txt += ' ${' + i.toString() + ':' + words[i] + '}';
                            if (depth < 0) {
                                res.push({
                                    label: words[i],
                                    kind: 4,
                                });
                            }
                        }

                        res.push({
                            label: words[1],
                            kind: 2,
                            insertText: new vscode.SnippetString(`${words[1]}${snip_txt}`),
                        });
                    }

                    if (depth < 0) depth = 0;
                }

                if (words[0] === 'if') {
                    depth -= 1;
                    if (depth < 0) depth = 0;
                }

                if (words[0] === '>' && depth <= 0) {
                    res.push({
                        label: line.slice(2),
                        kind: 5,
                    });
                }

                pos -= 1;
            }

            // {
            //     let pos = position.line;
            //     let raw = document.getText().split('\n');
            //     let depth = 0;
            //     while (pos >= 0) {
            //         let line = raw[pos].trim();
            //         if (line.startsWith('end') || line.startsWith('endif')) {
            //             depth += 1;
            //         } else if (line.startsWith('def') || line.startsWith('if')) {
            //             depth = 0;
            //         }
            //         if (depth <= 0) f.push(line);
            //         pos -= 1;
            //     }
            // }

            // for (let i = 0; i < f.length; i++) {
            //     let line = f[i].trim();
            //     if (line.startsWith('def ')) {
            //         let args = line.split(' ').slice(1);

            //         let snip_txt = '';
            //         for (let i = 1; i < args.length; i++) {
            //             snip_txt += ' ${' + i.toString() + ':' + args[i] + '}';
            //             res.push({
            //                 label: args[i],
            //                 kind: 4,
            //             });
            //         }

            //         res.push({
            //             label: args[0],
            //             kind: 2,
            //             insertText: new vscode.SnippetString(`${args[0]}${snip_txt}`),
            //         });
            //     } else if (line.startsWith('> ')) {
            //         res.push({
            //             label: line.slice(2),
            //             kind: 5,
            //         });
            //     }
            // }

            return res;
        },
    });

    context.subscriptions.push(autocomplete);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
