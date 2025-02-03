import fetch from 'node-fetch';
import * as vscode from 'vscode';

export class OllamaService {
    private baseUrl = 'http://localhost:11434/api';

    async generateResponse(prompt: string): Promise<string> {
        try {
            const config = vscode.workspace.getConfiguration('deepseek-vscode');
            const modelSize = config.get<string>('modelSize') || 'deepseek-r1:1.5b';

            const response = await fetch(`${this.baseUrl}/generate`, {
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
        } catch (error) {
            console.error('Error calling Ollama API:', error);
            throw error;
        }
    }
} 