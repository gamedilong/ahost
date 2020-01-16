"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ahostTreeDataProvider_1 = require("./ahostTreeDataProvider");
function activate(context) {
    console.log('Congratulations, your extension "ahost" is now active!');
    const ahostTreeDataProvider = new ahostTreeDataProvider_1.AHostTreeDataProvider(context);
    context.subscriptions.push(vscode.window.registerTreeDataProvider("ahost", ahostTreeDataProvider));
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World!');
    });
    let chooseHost = vscode.commands.registerCommand('ahost.choose', (item) => {
        ahostTreeDataProvider.choose(item);
    });
    let editHost = vscode.commands.registerCommand('ahost.edit', (params) => {
        ahostTreeDataProvider.edit(params);
    });
    let renameHost = vscode.commands.registerCommand('ahost.rename', (item) => {
        ahostTreeDataProvider.rename(item);
    });
    let addHost = vscode.commands.registerCommand('ahost.add', (item) => {
        ahostTreeDataProvider.add(item);
    });
    let delHost = vscode.commands.registerCommand('ahost.delete', (item) => {
        ahostTreeDataProvider.del(item);
    });
    let unchooseHost = vscode.commands.registerCommand('ahost.unchoose', (item) => {
        ahostTreeDataProvider.unchoose(item);
    });
    vscode.workspace.onDidSaveTextDocument((e) => {
        if (e.fileName && e.fileName.indexOf('.host') > -1) {
            ahostTreeDataProvider.syncChooseHost();
        }
    });
    context.subscriptions.push(addHost);
    context.subscriptions.push(delHost);
    context.subscriptions.push(renameHost);
    context.subscriptions.push(chooseHost);
    context.subscriptions.push(unchooseHost);
    context.subscriptions.push(editHost);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map