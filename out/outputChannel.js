"use strict";
"user strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const dateUtil_1 = require("./dateUtil");
class OutputChannel {
    static appendLine(value) {
        OutputChannel.outputChannel.show(true);
        OutputChannel.outputChannel.appendLine(`[Info ${dateUtil_1.DateUtil.formatDate(new Date(), "YYYY-MM-DD HH:mm")}] ahost>> ${value}`);
    }
}
exports.OutputChannel = OutputChannel;
OutputChannel.outputChannel = vscode.window.createOutputChannel("AHost");
//# sourceMappingURL=outputChannel.js.map