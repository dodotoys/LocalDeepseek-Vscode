import * as vscode from 'vscode';
import { OllamaService } from './ollamaService';

export class ChatProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    
    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _ollamaService: OllamaService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    try {
                        const response = await this._ollamaService.generateResponse(data.message);
                        webviewView.webview.postMessage({ 
                            type: 'receiveMessage', 
                            message: response 
                        });
                    } catch (error) {
                        vscode.window.showErrorMessage('Error communicating with DeepSeek model');
                    }
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>DeepSeek Chat</title>
                <style>
                    .chat-container {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        padding: 10px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .messages {
                        flex: 1;
                        overflow-y: auto;
                        margin-bottom: 10px;
                        max-height: calc(100% - 50px);
                    }
                    .input-container {
                        display: flex;
                        position: absolute;
                        bottom: 10px;
                        left: 10px;
                        right: 10px;
                    }
                    #messageInput {
                        flex: 1;
                        margin-right: 10px;
                        padding: 5px;
                    }
                    .message {
                        margin-bottom: 10px;
                        padding: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="chat-container">
                    <div class="messages" id="messages"></div>
                    <div class="input-container">
                        <input type="text" id="messageInput" placeholder="Type your message...">
                        <button onclick="sendMessage()">Send</button>
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const messagesContainer = document.getElementById('messages');
                    const messageInput = document.getElementById('messageInput');

                    function sendMessage() {
                        const message = messageInput.value;
                        if (message) {
                            appendMessage('User: ' + message);
                            vscode.postMessage({
                                type: 'sendMessage',
                                message: message
                            });
                            messageInput.value = '';
                        }
                    }

                    function appendMessage(message) {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = message;
                        messagesContainer.appendChild(messageElement);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.type) {
                            case 'receiveMessage':
                                appendMessage('DeepSeek: ' + message.message);
                                break;
                        }
                    });

                    messageInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
} 