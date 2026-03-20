const fs = require('fs');
const path = require('path');
const os = require('os');

const extensionName = 'snoopy-typer';
const vscodeExtDir = path.join(os.homedir(), '.vscode', 'extensions', extensionName);
const currentDir = process.cwd();

console.log('Iniciando instalação do Snoopy Typer...');

if (fs.existsSync(vscodeExtDir)) {
    console.log('O Snoopy já está instalado! Removendo versão antiga...');
    try {
        fs.unlinkSync(vscodeExtDir);
    } catch (e) {
        try {
            fs.rmSync(vscodeExtDir, { recursive: true, force: true });
        } catch (rmErr) {}
    }
}

try {
    fs.symlinkSync(currentDir, vscodeExtDir, os.platform() === 'win32' ? 'junction' : 'dir');
    console.log('SUCESSO! O Snoopy foi instalado no seu VS Code.');
    console.log('Agora, feche e abra seu VS Code novamente para ele aparecer.');
} catch (err) {
    console.error('Erro ao criar atalho. Tente rodar o terminal como Administrador/Sudo.', err);
}