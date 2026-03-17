const vscode = require('vscode');

class SnoopyViewProvider {
    constructor(extensionUri) 
    {
        this._extensionUri = extensionUri;
    }

    resolveWebviewView (webviewView)
    {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlContent(webviewView);

        webviewView.webview.onDidReceiveMessage(message => {
            if (message.command === 'alert') {
                vscode.window.showInformationMessage(message.text);
            }
        });
    }

    _getHtmlContent(webview) 
    {
        const sleepUri = webview.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-sleeping.gif'));
        const typeUri = webview.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'snoopy-typing.gif'));
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
                body { font-family: sans-serif; text-align: center; padding: 20px; }
                #status { color: #555; }
            </style>
        </head>
        <body>
            <img id="snoopy-img" src="${sleepUri}" alt="Snoopy GIF">

            <script>
                const vscode = acquireVsCodeApi();
                const statusElement = document.getElementById('status');
                const imgElement = document.getElementById('snoopy-img');
                let timer;

                window.addEventListener('message', event => {
                    const message = event.data;

                    switch (message.command) {
                        case 'type':
                            imgElement.src = '${typeUri}';
                            clearTimeout(timer);

                            timer = setTimeout(() => {
                                imgElement.src = '${sleepUri}';
                            }, 2080);
                            break;
                    }
                });
            </script>    
        </body>
        </html>`;
    }

    handleType() {
        if (this._view) {
            this._view.webview.postMessage({command: 'type'});
        }
    }
}

function activate (context)
{
    const provider = new SnoopyViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('snoopy-view', provider)
    );

    let disposable = vscode.workspace.onDidChangeTextDocument(event => {
        console.log('Document changed:', event.document.fileName);
        console.log('Changes:', event.contentChanges);
        provider.handleType();
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}
module.exports = { 
    activate,
    deactivate
};

