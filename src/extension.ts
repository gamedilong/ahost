import * as vscode from 'vscode';
import { AHostTreeDataProvider, HostConfig } from './ahostTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "ahost" is now active!');
    const ahostTreeDataProvider = new AHostTreeDataProvider(context);
    context.subscriptions.push(vscode.window.registerTreeDataProvider("ahost", ahostTreeDataProvider));

	let chooseHost = vscode.commands.registerCommand('ahost.choose', (item: HostConfig) => {
		ahostTreeDataProvider.choose(item);
	});
	let editHost = vscode.commands.registerCommand('ahost.edit', (params) => {
		ahostTreeDataProvider.edit(params);
	});
	let renameHost = vscode.commands.registerCommand('ahost.rename', (item: HostConfig) => {
		ahostTreeDataProvider.rename(item);
	});
	let addHost = vscode.commands.registerCommand('ahost.add', (item: HostConfig) => {
		ahostTreeDataProvider.add(item);
	});
	let delHost = vscode.commands.registerCommand('ahost.delete', (item: HostConfig) => {
		ahostTreeDataProvider.del(item);
	});
	let unchooseHost = vscode.commands.registerCommand('ahost.unchoose', (item: HostConfig) => {
		ahostTreeDataProvider.unchoose(item);
	});
	vscode.workspace.onDidSaveTextDocument((e:vscode.TextDocument) =>{
		if(e.fileName && e.fileName.indexOf('.host') > -1){
			ahostTreeDataProvider.syncChooseHost();
		}
	})
	context.subscriptions.push(addHost);
	context.subscriptions.push(delHost);
	context.subscriptions.push(renameHost);
	context.subscriptions.push(chooseHost);
	context.subscriptions.push(unchooseHost);
	context.subscriptions.push(editHost);
}

// this method is called when your extension is deactivated
export function deactivate() {}
