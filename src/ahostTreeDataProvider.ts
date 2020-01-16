import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { FileUtil } from './fileUtil';
export class AHostTreeDataProvider implements vscode.TreeDataProvider<HostConfig> {

	private _onDidChangeTreeData: vscode.EventEmitter<HostConfig | undefined> = new vscode.EventEmitter<HostConfig | undefined>();
	readonly onDidChangeTreeData: vscode.Event<HostConfig | undefined> = this._onDidChangeTreeData.event;
    // readonly appRoot:string = vscode.env.appRoot;
	private userRoot:string;
	constructor(private context: vscode.ExtensionContext) {
        // check ahost config floder if exists
		this.userRoot = os.homedir();
        if(!FileUtil.pathExists(path.join(this.userRoot, '.ahost'))) {
            //if not exists create default ahost floder
            try{
                FileUtil.createDefaultAHostFloder(this.userRoot);
            }catch(e){
                vscode.window.showInformationMessage('Ahost need Administrator permission!');
            }
        }
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HostConfig): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HostConfig): Thenable<HostConfig[]> {
		let files:string[] = FileUtil.getAhostConfigFileList(this.userRoot);
		let metaInfo = FileUtil.getMetaInfo(this.userRoot);
		if (files && files.length > 0) {
			let hostConfigs = new Array<HostConfig>();
			files.forEach((file)=>{
				let filePath = path.join(this.userRoot,'.ahost',file)
				let uri = vscode.Uri.file(filePath);
				let label = path.basename(file,'.host');
				hostConfigs.push(new HostConfig(
					label, 
					vscode.TreeItemCollapsibleState.None,
					{command:"ahost.edit",title:"",arguments:[uri]},
					`ahostItem${metaInfo.cur.indexOf(label) > -1? 1:0}`,
					filePath,
					metaInfo.cur.indexOf(label) > -1
				));
			});

			return Promise.resolve(hostConfigs);
		}else{
			return Promise.resolve([]);
		}
	}

	choose(item: HostConfig):void{
		if(item.filePath){
			let metaInfo = FileUtil.getMetaInfo(this.userRoot);
			if(metaInfo.cur.indexOf(item.label) > -1){
				vscode.window.showInformationMessage('This host is choosed areadly!');
			}else{
				metaInfo.cur.push(item.label);
				FileUtil.setMetaInfo(this.userRoot,metaInfo);
				FileUtil.syncChooseHost(this.userRoot);
				this._onDidChangeTreeData.fire();
				vscode.window.showInformationMessage('This host is choosed areadly!');
			}

		}
	}
	syncChooseHost():void{
		FileUtil.syncChooseHost(this.userRoot);
	}
	unchoose(item: HostConfig):void{
		if(item.filePath){
			let metaInfo = FileUtil.getMetaInfo(this.userRoot);
			let labelIndex = metaInfo.cur.indexOf(item.label)
			if(labelIndex > -1){
				metaInfo.cur.splice(labelIndex,1);
				FileUtil.setMetaInfo(this.userRoot,metaInfo);
				FileUtil.syncChooseHost(this.userRoot);
				this._onDidChangeTreeData.fire();
				vscode.window.showInformationMessage('UnChoose Host Success!');
			}
		}
	}
	edit(params:any):void{
		vscode.workspace.openTextDocument(params).then(
			document => vscode.window.showTextDocument(document)
		);
	}

	rename(item: HostConfig):void{
		vscode.window.showInputBox({ placeHolder: 'Enter the new host name', value: item.label })
		.then((value) => {
			if(value){
				let files:string[] = FileUtil.getAhostConfigFileList(this.userRoot);
				if(files && files.indexOf(`${value}.host`) > -1){
					vscode.window.showInformationMessage('This name is aready exist!');
				}else{
					FileUtil.renameHostFile(this.userRoot,item.label, value);
					let metaInfo = FileUtil.getMetaInfo(this.userRoot);
					let labelIndex = metaInfo.cur.indexOf(item.label);
					if(labelIndex > -1){
						metaInfo.cur[labelIndex] = value;
						FileUtil.setMetaInfo(this.userRoot, metaInfo);
					}
					this._onDidChangeTreeData.fire();
				}
			}else{
				vscode.window.showInformationMessage('Please enter your host name!');
			}
		});	
	}

	add(item: HostConfig):void{
		vscode.window.showInputBox({ placeHolder: 'Enter the new host name' })
		.then(value => {
			if(!value) { 
				return; 
			}				
			let files:string[] = FileUtil.getAhostConfigFileList(this.userRoot);
			let a = files.filter((file)=>{
				let basename = path.basename(file, '.host');
				return basename === value;
			});
			if(!a || a.length === 0){
				FileUtil.createHostFile(this.userRoot, value);
				this._onDidChangeTreeData.fire();
			}
		});	
	}
	del(item: HostConfig):void{
		FileUtil.delHostFile(this.userRoot, item);
		this._onDidChangeTreeData.fire();
	}
}

export class HostConfig extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public contextValue?:string,
		public filePath?:string,
		public chooseStatus?:boolean
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string |boolean {
		return false;
	}
	
	get iconPath(): string {
		return path.join(__filename, '..','..', 'resources', 'light', this.chooseStatus ? 'choose.svg':'H.svg',);
	}

}