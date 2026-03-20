🐾 Snoopy Typer

Uma extensão interativa para o Visual Studio Code que adiciona o Snoopy como seu companheiro de codificação, reagindo às suas ações em tempo real.
✨ Novas Funcionalidades

    Onipresente: Agora o Snoopy te acompanha tanto na aba de Arquivos (Explorer) quanto na aba do Git (Source Control).

    Animação de Digitação: Ele acorda e usa a máquina de escrever sempre que você digita no editor.

    Comemoração de Commit: O Snoopy dá um "OK" quando detecta que você realizou um commit com sucesso.

    Reação a Erros: Ele solta uma risadinha se um comando no seu terminal terminar com erro (Exit Code diferente de 0).

    Sincronia Inteligente: As animações possuem transições suaves para garantir que o Snoopy nunca pare de digitar "no meio do caminho".

🛠️ Tecnologias e Conceitos

    VS Code API Avançada:

        WebviewViewProvider com suporte a múltiplas instâncias sincronizadas.

        Integração com a Git API nativa do VS Code para monitorar o estado do HEAD.

        Escuta de eventos de terminal via onDidEndTerminalShellExecution.

    Arquitetura de Mensageria: Sistema de broadcast para enviar comandos para todas as views abertas simultaneamente.

    Automação de Instalação: Script cross-platform para instalação local via links simbólicos.

🚀 Como Rodar e Instalar
Modo Desenvolvedor (F5)

    Clone o repositório.

    Execute npm install.

    Pressione F5 para abrir a janela de teste (Extension Development Host).

Instalação Fixa (Para uso diário)

Se você quer que o Snoopy fique instalado permanentemente sem precisar do modo debug:

    No terminal da pasta do projeto, execute:
    Bash

    npm run install-snoopy

    Reinicie o seu VS Code.

    O Snoopy aparecerá automaticamente na sua barra lateral!

Projeto desenvolvido por gabgds para estudos aprofundados sobre integração de ferramentas e UX dentro do ecossistema VS Code.
