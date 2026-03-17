# 🐾 Snoopy Typer

Uma extensão para o Visual Studio Code criada para fins de estudo, que adiciona um companheiro de codificação (Snoopy) que reage à sua digitação em tempo real.

## 🚀 Funcionalidades
- **Companheiro Dinâmico:** O Snoopy fica na barra lateral (Explorer) observando seu trabalho.
- **Animação Reativa:** Quando você começa a digitar, o Snoopy acorda e começa a usar sua máquina de escrever.
- **Sincronia de Animação:** O Snoopy termina o ciclo da animação antes de voltar a dormir, garantindo uma transição suave.
- **Interface Responsiva:** O conteúdo se ajusta automaticamente ao redimensionar a barra lateral.

## 🛠️ Tecnologias e Conceitos Utilizados
- **JavaScript (Node.js):** Lógica principal da extensão.
- **VS Code API:** - `WebviewViewProvider` para criar a interface customizada.
  - `workspace.onDidChangeTextDocument` para detectar a digitação.
  - Mensageria (`postMessage`) para comunicação entre a extensão e o HTML.
- **Frontend (HTML5/CSS3):** Criação da interface e estilização responsiva.
- **Scripts de Animação:** Uso de `setTimeout` e `clearTimeout` para controle de estado dos GIFs.

## 📖 Como rodar este projeto
1. Clone o repositório.
2. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
3. Abra a pasta no VS Code e pressione `F5` para iniciar uma janela de teste com a extensão ativa.

---
*Projeto desenvolvido por gabgds para estudos sobre desenvolvimento de extensões e integração de ferramentas.*