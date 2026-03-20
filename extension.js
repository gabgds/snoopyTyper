const vscode = require('vscode');

class SnoopyViewProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._views = [];
    }

    resolveWebviewView(webviewView) {
        this._views.push(webviewView);

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlContent(webviewView.webview);

        webviewView.onDidDispose(() => {
            this._views = this._views.filter(v => v !== webviewView);
        });
    }

    _getHtmlContent(webview) {
        const sleepUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-sleeping.gif'));
        const typeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-typing.gif'));
        const laughUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-laugh.gif'));
        const okUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-ok.gif'));

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'unsafe-inline';">
            <meta charset="UTF-8">
            <style>
                #snoopy-img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                body { font-family: sans-serif; text-align: center; padding: 20px; overflow: hidden; }
            </style>
        </head>
        <body>
            <img id="snoopy-img" src="${sleepUri}" alt="Snoopy GIF">
            <script>
                const imgElement = document.getElementById('snoopy-img');
                let timer;

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'type':
                            imgElement.src = '${typeUri}';
                            clearTimeout(timer);
                            timer = setTimeout(() => { imgElement.src = '${sleepUri}'; }, 2080);
                            break;
                        case 'error':
                            imgElement.src = '${laughUri}';
                            clearTimeout(timer);
                            timer = setTimeout(() => { imgElement.src = '${sleepUri}'; }, 3000);
                            break;
                        case 'success':
                            imgElement.src = '${okUri}';
                            clearTimeout(timer);
                            timer = setTimeout(() => { imgElement.src = '${sleepUri}'; }, 3000);
                            break;
                    }
                });
            </script>    
        </body>
        </html>`;
    }

    handleType() {
        this.sendMessage({ command: 'type' });
    }

    sendMessage(message) {
        this._views.forEach(view => {
            view.webview.postMessage(message);
        });
    }
}

async function activate(context) {
    const provider = new SnoopyViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('snoopy-view-explorer', provider)
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('snoopy-view-scm', provider)
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => {
            provider.handleType();
        })
    );

    vscode.window.onDidEndTerminalShellExecution(event => {
        try {
            const cmd = event.execution.commandLine.value || "";
            if (event.exitCode !== 0) {
                provider.sendMessage({ command: 'error' });
            } else if (event.exitCode === 0 && (cmd.includes('push') || cmd.includes('commit'))) {
                provider.sendMessage({ command: 'success' });
            }
        } catch (e) {}
    });

    try {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
            await gitExtension.activate();
            const gitApi = gitExtension.exports.getAPI(1);

            gitApi.repositories.forEach(repo => {
                let lastCommit = repo.state.HEAD?.commit;

                repo.state.onDidChange(() => {
                    const currentCommit = repo.state.HEAD?.commit;
                    if (currentCommit !== lastCommit) {
                        lastCommit = currentCommit;
                        provider.sendMessage({ command: 'success' });
                    }
                });
            });

            gitApi.onDidOpenRepository(repo => {
                let lastCommit = repo.state.HEAD?.commit;
                repo.state.onDidChange(() => {
                    const currentCommit = repo.state.HEAD?.commit;
                    if (currentCommit !== lastCommit) {
                        lastCommit = currentCommit;
                        provider.sendMessage({ command: 'success' });
                    }
                });
            });
        }
    } catch (error) {}
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};