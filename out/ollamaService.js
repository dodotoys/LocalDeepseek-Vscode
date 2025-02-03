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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const vscode = __importStar(require("vscode"));
class OllamaService {
    constructor() {
        this.baseUrl = 'http://localhost:11434/api';
    }
    async generateResponse(prompt) {
        try {
            const config = vscode.workspace.getConfiguration('deepseek-vscode');
            const modelSize = config.get('modelSize') || 'deepseek-r1:1.5b';
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelSize,
                    prompt: prompt,
                    stream: false
                }),
            });
            const data = await response.json();
            return data.response;
        }
        catch (error) {
            console.error('Error calling Ollama API:', error);
            throw error;
        }
    }
}
exports.OllamaService = OllamaService;
//# sourceMappingURL=ollamaService.js.map