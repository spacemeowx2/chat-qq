import * as vscode from 'vscode'
import { QQUnreadTreeProvider, QQGroupsTreeProvider } from './provider'
import { QQClient } from './qqclient'

export function activate(context: vscode.ExtensionContext) {
  const client = new QQClient(context)
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.chatqq.setserver', () => {
      vscode.window.showInformationMessage('Hello World!')
    }),
    vscode.window.registerTreeDataProvider('chatqq-messages', new QQUnreadTreeProvider(client)),
    vscode.window.registerTreeDataProvider('chatqq-groups', new QQGroupsTreeProvider(client)),
  )

  console.log('chat-qq activate')
}

// this method is called when your extension is deactivated
export function deactivate() {}
