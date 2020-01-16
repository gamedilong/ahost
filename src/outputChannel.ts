"user strict";
import * as vscode from "vscode";
import { DateUtil} from './dateUtil'

export class OutputChannel {
    public static appendLine(value: string) {
        OutputChannel.outputChannel.show(true);
        OutputChannel.outputChannel.appendLine(`[Info ${DateUtil.formatDate(new Date(),"YYYY-MM-DD HH:mm")}] ahost>> ${value}`);
    }

    private static outputChannel = vscode.window.createOutputChannel("AHost");
}