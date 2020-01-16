"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const os = require("os");
const fileUtil_1 = require("./fileUtil");
class AHostTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // check ahost config floder if exists
        this.userRoot = os.homedir();
        if (!fileUtil_1.FileUtil.pathExists(path.join(this.userRoot, '.ahost'))) {
            //if not exists create default ahost floder
            try {
                fileUtil_1.FileUtil.createDefaultAHostFloder(this.userRoot);
            }
            catch (e) {
                vscode.window.showInformationMessage('Ahost need Administrator permission!');
            }
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let files = fileUtil_1.FileUtil.getAhostConfigFileList(this.userRoot);
        let metaInfo = fileUtil_1.FileUtil.getMetaInfo(this.userRoot);
        if (files && files.length > 0) {
            let hostConfigs = new Array();
            files.forEach((file) => {
                let filePath = path.join(this.userRoot, '.ahost', file);
                let uri = vscode.Uri.file(filePath);
                let label = path.basename(file, '.host');
                hostConfigs.push(new HostConfig(label, vscode.TreeItemCollapsibleState.None, { command: "ahost.edit", title: "", arguments: [uri] }, `ahostItem${metaInfo.cur.indexOf(label) > -1 ? 1 : 0}`, filePath, metaInfo.cur.indexOf(label) > -1));
            });
            return Promise.resolve(hostConfigs);
        }
        else {
            return Promise.resolve([]);
        }
    }
    choose(item) {
        if (item.filePath) {
            let metaInfo = fileUtil_1.FileUtil.getMetaInfo(this.userRoot);
            if (metaInfo.cur.indexOf(item.label) > -1) {
                vscode.window.showInformationMessage('This host is choosed areadly!');
            }
            else {
                metaInfo.cur.push(item.label);
                fileUtil_1.FileUtil.setMetaInfo(this.userRoot, metaInfo);
                fileUtil_1.FileUtil.syncChooseHost(this.userRoot);
                this._onDidChangeTreeData.fire();
                vscode.window.showInformationMessage('This host is choosed areadly!');
            }
        }
    }
    syncChooseHost() {
        fileUtil_1.FileUtil.syncChooseHost(this.userRoot);
    }
    unchoose(item) {
        if (item.filePath) {
            let metaInfo = fileUtil_1.FileUtil.getMetaInfo(this.userRoot);
            let labelIndex = metaInfo.cur.indexOf(item.label);
            if (labelIndex > -1) {
                metaInfo.cur.splice(labelIndex, 1);
                fileUtil_1.FileUtil.setMetaInfo(this.userRoot, metaInfo);
                fileUtil_1.FileUtil.syncChooseHost(this.userRoot);
                this._onDidChangeTreeData.fire();
                vscode.window.showInformationMessage('UnChoose Host Success!');
            }
        }
    }
    edit(params) {
        vscode.workspace.openTextDocument(params).then(document => vscode.window.showTextDocument(document));
    }
    rename(item) {
        vscode.window.showInputBox({ placeHolder: 'Enter the new host name', value: item.label })
            .then((value) => {
            if (value) {
                let files = fileUtil_1.FileUtil.getAhostConfigFileList(this.userRoot);
                if (files && files.indexOf(`${value}.host`) > -1) {
                    vscode.window.showInformationMessage('This name is aready exist!');
                }
                else {
                    fileUtil_1.FileUtil.renameHostFile(this.userRoot, item.label, value);
                    let metaInfo = fileUtil_1.FileUtil.getMetaInfo(this.userRoot);
                    let labelIndex = metaInfo.cur.indexOf(item.label);
                    if (labelIndex > -1) {
                        metaInfo.cur[labelIndex] = value;
                        fileUtil_1.FileUtil.setMetaInfo(this.userRoot, metaInfo);
                    }
                    this._onDidChangeTreeData.fire();
                }
            }
            else {
                vscode.window.showInformationMessage('Please enter your host name!');
            }
        });
    }
    add(item) {
        vscode.window.showInputBox({ placeHolder: 'Enter the new host name' })
            .then(value => {
            if (!value) {
                return;
            }
            let files = fileUtil_1.FileUtil.getAhostConfigFileList(this.userRoot);
            let a = files.filter((file) => {
                let basename = path.basename(file, '.host');
                return basename === value;
            });
            if (!a || a.length === 0) {
                fileUtil_1.FileUtil.createHostFile(this.userRoot, value);
                this._onDidChangeTreeData.fire();
            }
        });
    }
    del(item) {
        fileUtil_1.FileUtil.delHostFile(this.userRoot, item);
        this._onDidChangeTreeData.fire();
    }
}
exports.AHostTreeDataProvider = AHostTreeDataProvider;
class HostConfig extends vscode.TreeItem {
    constructor(label, collapsibleState, command, contextValue, filePath, chooseStatus) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.contextValue = contextValue;
        this.filePath = filePath;
        this.chooseStatus = chooseStatus;
    }
    get tooltip() {
        return `${this.label}`;
    }
    get description() {
        return false;
    }
    get iconPath() {
        return path.join(__filename, '..', '..', 'resources', 'light', this.chooseStatus ? 'choose.svg' : 'H.svg');
    }
}
exports.HostConfig = HostConfig;
//# sourceMappingURL=ahostTreeDataProvider.js.map