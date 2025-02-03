import * as vscode from 'vscode';
import { ChatProvider } from './chatProvider';
import { OllamaService } from './ollamaService';

export function activate(context: vscode.ExtensionContext) {
    console.log('DeepSeek extension is now active!');
    console.log('Extension path:', context.extensionUri.fsPath);
    console.log('Registering webview provider for deepseek-chat');
    
    const ollamaService = new OllamaService();
    const chatProvider = new ChatProvider(context.extensionUri, ollamaService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'deepseek-chat',
            chatProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

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

export function deactivate() {} 