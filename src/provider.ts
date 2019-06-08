import * as vscode from 'vscode'
import { QQClient } from './qqclient'

class QQTreeItem extends vscode.TreeItem {

}

class QQGroupItem extends vscode.TreeItem {
  constructor (id: number, name: string) {
    super(name)
    this.tooltip = `${name} (${id})`
    this.contextValue = 'group'
  }
}

export class QQUnreadTreeProvider implements vscode.TreeDataProvider<string> {
  emitter = new vscode.EventEmitter<string>()
  onDidChangeTreeData = this.emitter.event
  constructor (private client: QQClient) {

  }
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


export class QQGroupsTreeProvider implements vscode.TreeDataProvider<QQGroupItem> {
  emitter = new vscode.EventEmitter<QQGroupItem>()
  onDidChangeTreeData = this.emitter.event
  groups: QQGroupItem[] = []
  constructor (private client: QQClient) {
    client.groupEmitter.event(e => {
      this.groups = e.map(({ group_id, group_name }) => new QQGroupItem(group_id, group_name))
      this.emitter.fire()
    })
  }
	getTreeItem(element: QQGroupItem): vscode.TreeItem {
		return element
  }
  async getChildren(element?: QQGroupItem): Promise<QQGroupItem[]> {
    if (element === undefined) {
      return this.groups
    }
    return []
  }
}
