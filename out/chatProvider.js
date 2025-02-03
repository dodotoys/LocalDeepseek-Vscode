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
exports.ChatProvider = void 0;
const vscode = __importStar(require("vscode"));
class ChatProvider {
    constructor(_extensionUri, _ollamaService) {
        this._extensionUri = _extensionUri;
        this._ollamaService = _ollamaService;
    }
    resolveWebviewView(webviewView, context, _token) {
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
                    }
                    catch (error) {
                        vscode.window.showErrorMessage('Error communicating with DeepSeek model');
                    }
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
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
exports.ChatProvider = ChatProvider;
//# sourceMappingURL=chatProvider.js.map