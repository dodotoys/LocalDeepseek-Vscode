"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const chatProvider_1 = require("./chatProvider");
const ollamaService_1 = require("./ollamaService");
function activate(context) {
    console.log('DeepSeek extension is now active!');
    console.log('Extension path:', context.extensionUri.fsPath);
    console.log('Registering webview provider for deepseek-chat');
    const ollamaService = new ollamaService_1.OllamaService();
    const chatProvider = new chatProvider_1.ChatProvider(context.extensionUri, ollamaService);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('deepseek-chat', chatProvider, {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    }));
    let startChat = vscode.commands.registerCommand('deepseek-vscode.startChat', () => {
        vscode.commands.executeCommand('deepseek-chat.focus');
    });
    let changeModel = vscode.commands.registerCommand('deepseek-vscode.changeModel', async () => {
        const models = [
            { label: 'Small (1.5B)', description: 'Requires ~2GB memory', value: 'deepseek-r1:1.5b' },
            { label: 'Medium (7B)', description: 'Requires ~6GB memory', value: 'deepseek-r1:7b' },
            { label: 'Large (14B)', description: 'Requires ~10GB memory', value: 'deepseek-r1:14b' }
        ];
        const selected = await vscode.window.showQuickPick(models, {
            placeHolder: 'Select DeepSeek Model Size'
        });
        if (selected) {
            await vscode.workspace.getConfiguration('deepseek-vscode').update('modelSize', selected.value, true);
            vscode.window.showInformationMessage(`Switched to ${selected.label} model`);
        }
    });
    context.subscriptions.push(startChat);
    context.subscriptions.push(changeModel);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map