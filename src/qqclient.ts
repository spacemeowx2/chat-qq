import { CQWebSocket, WebSocketType } from 'cq-websocket'
import * as vscode from 'vscode'
import { ExtensionId } from './constant'

export const enum BotPostType {
  Message = 'message',
  Request = 'request',
  Any = 'any'
}
export const enum BotMessageType {
  Group = 'group',
  Private = 'private',
  Discuss = 'discuss'
}
export class QQMessage {
  postType: BotPostType = BotPostType.Message
  selfId: number
  time: number
  groupId?: number
  message: string
  messageId: number
  messageType: BotMessageType
  userId: number
  constructor (c: Record<string, any>) {
    if (c.post_type !== 'message') {
      throw new Error('not a message')
    }
    this.postType = c.post_type,
    this.groupId = c.group_id,
    this.message = c.message,
    this.messageId = c.message_id,
    this.messageType = c.message_type,
    this.selfId = c.self_id,
    this.time = c.time,
    this.userId = c.user_id
  }
}

export type QQGroupList = {
  group_id: number
  group_name: string
}[]

export class QQClient {
  server: string = ''
  bot: CQWebSocket | undefined
  accessToken = ''
  messageEmitter = new vscode.EventEmitter<QQMessage>()
  groupEmitter = new vscode.EventEmitter<QQGroupList>()
  constructor (private ctx: vscode.ExtensionContext) {
    this.getConfig()
    ctx.subscriptions.push(this.messageEmitter)
  }
  private getConfig () {
    const cfg = vscode.workspace.getConfiguration(ExtensionId)
    const getCfgs = () => {
      this.server = cfg.get('server', '')
      this.accessToken = cfg.get('accessToken', '')
      this.onServerChange()
    }
    getCfgs()
    this.ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('server') || e.affectsConfiguration('accessToken')) {
        getCfgs()
      }
    }))
  }
  private onServerChange () {
    if (this.server === '') {
      vscode.window.showInformationMessage('Chat QQ: The server is empty, please set server to use.')
      return
    }
    const uri = vscode.Uri.parse(this.server)
    const [host, port] = uri.authority.split(':')
    if (this.bot) {
      this.bot.disconnect()
    }
    this.bot = new CQWebSocket({
      host,
      port: parseInt(port),
      accessToken: this.accessToken
    })
    this.bot.on("socket.connecting", (wsType, attempts) => {
      console.log("嘗試第 %d 次連線 _(:з」∠)_", attempts);
    })
    .on("socket.connect", (wsType, sock, attempts) => {
      console.log("第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ", attempts);
      if (wsType === WebSocketType.API) {
        this.getInfo()
      }
    })
    .on("socket.failed", (wsType, attempts) => {
      console.log("第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･", attempts);
    })
    .on("socket.error", (type, err) => {
      console.error("socket.error", err.toString());
    })
    .on("message", (e, c) => {
      e.getMessage()
      this.messageEmitter.fire(new QQMessage(c))
    })
    .connect()
  }
  private async getInfo () {
    if (!this.bot) {
      return
    }
    const r = await this.bot<QQGroupList>('get_group_list')
    if (r.retcode === 0) {
      this.groupEmitter.fire(r.data)
    } else {
      console.error('Err: get_group_list', r)
    }
  }
  dispose () {
    if (this.bot) {
      this.bot.disconnect()
    }
  }
}
