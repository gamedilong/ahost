"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const os = require("os");
const outputChannel_1 = require("./outputChannel");
class FileUtil {
    static createDefaultAHostFloder(appRoot) {
        outputChannel_1.OutputChannel.appendLine(`Ready to create ${path.join(appRoot, '.ahost')}`);
        fs.mkdirSync(path.join(appRoot, '.ahost'));
        // create current host file
        const osType = os.platform();
        let sysHostPath = osType.indexOf('win32') > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
        let data = fs.readFileSync(sysHostPath);
        fs.writeFileSync(path.join(appRoot, '.ahost', 'default.host'), data);
        // set default choose host
        fs.writeFileSync(path.join(appRoot, '.ahost', this.META_FILE_NAME), JSON.stringify({ cur: ['default'] }));
        outputChannel_1.OutputChannel.appendLine(`Create ${path.join(appRoot, '.ahost')} success`);
    }
    static createHostFile(appRoot, name) {
        fs.writeFileSync(path.join(appRoot, '.ahost', `${name}.host`), `# enjoy ahost : ${name} \n`);
    }
    static renameHostFile(appRoot, oldname, name) {
        fs.renameSync(path.join(appRoot, '.ahost', `${oldname}.host`), path.join(appRoot, '.ahost', `${name}.host`));
    }
    static getMetaInfo(appRoot) {
        var metaData = fs.readFileSync(path.join(appRoot, '.ahost', this.META_FILE_NAME));
        return JSON.parse(metaData.toString());
    }
    static setMetaInfo(appRoot, data) {
        fs.writeFileSync(path.join(appRoot, '.ahost', this.META_FILE_NAME), JSON.stringify(data));
    }
    static delHostFile(appRoot, item) {
        // del metainfo
        let metaInfo = this.getMetaInfo(appRoot);
        let curLabelIndex = metaInfo.cur.indexOf(path.basename(item.label, '.host'));
        if (metaInfo.cur && curLabelIndex > -1) {
            metaInfo.cur.splice(curLabelIndex, 1);
            this.setMetaInfo(appRoot, metaInfo);
        }
        if (fs.existsSync(item.filePath)) {
            fs.unlinkSync(item.filePath);
        }
    }
    static getAhostConfigFileList(appRoot) {
        outputChannel_1.OutputChannel.appendLine(`Ready to get usefull host config from : ${path.join(appRoot, '.ahost')} floder.`);
        let hostFiles = fs.readdirSync(path.join(appRoot, '.ahost'));
        let usefullHostFiles = new Array();
        if (hostFiles && hostFiles.length > 0) {
            hostFiles.forEach((hostFile) => {
                let fileStats = fs.statSync(path.join(appRoot, '.ahost', hostFile));
                if (fileStats.isFile() && hostFile !== this.META_FILE_NAME) {
                    usefullHostFiles.push(hostFile);
                }
            });
        }
        outputChannel_1.OutputChannel.appendLine(`Get usefull host config from : ${path.join(appRoot, '.ahost')} success`);
        return usefullHostFiles;
    }
    static syncChooseHost(appRoot) {
        const osType = os.platform();
        let sysHostPath = osType.indexOf('win32') > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
        let data = '';
        let metaInfo = this.getMetaInfo(appRoot);
        let files = this.getAhostConfigFileList(appRoot);
        if (files && files.length > 0) {
            files.forEach((file) => {
                if (metaInfo.cur.indexOf(path.basename(file, '.host')) > -1) {
                    let filePath = path.join(appRoot, '.ahost', file);
                    let curHostData = fs.readFileSync(filePath).toString();
                    data = data + `\n# host ${file} start\n` + curHostData + `\n# host ${file} end\n`;
                }
            });
        }
        fs.writeFileSync(sysHostPath, data);
        outputChannel_1.OutputChannel.appendLine(`syncChooseHost: ${metaInfo.cur.join(',')}success`);
    }
    static pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.FileUtil = FileUtil;
FileUtil.WIN32_HOST_PATH = "C:\\Windows\\System32\\drivers\\etc\\hosts";
FileUtil.MAC_HOST_PATH = "/etc/hosts";
FileUtil.META_FILE_NAME = "meta.json";
//# sourceMappingURL=fileUtil.js.map