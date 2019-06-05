import * as vscode from 'vscode'

class QQTreeItem extends vscode.TreeItem {

}

export class QQTreeProvider implements vscode.TreeDataProvider<string> {
	getTreeItem(element: string): vscode.TreeItem {
		return {
      label: element
    }
  }
  async getChildren(element?: string): Promise<string[]> {
    console.log('getChildren', element)
    if (element === undefined) {
      return ['UNREADS', 'FRIENDS', 'GROUPS']
    }
    return ["asdf"]
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.chatqq.setserver', () => {
      vscode.window.showInformationMessage('Hello World!')
    }),
    vscode.window.registerTreeDataProvider('chatqq-treeview', new QQTreeProvider())
  )
  console.log('chat-qq activate')
}

// this method is called when your extension is deactivated
export function deactivate() {}
