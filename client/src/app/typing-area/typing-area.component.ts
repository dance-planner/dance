import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'

export interface IMessage {
  text: string
  fromChatBot: boolean
}

@Component({
  selector: 'app-typing-area',
  templateUrl: './typing-area.component.html',
  styleUrls: ['./typing-area.component.css'],
})
export class TypingAreaComponent implements OnInit, OnChanges {

  @Input() public messages: IMessage[] = []
  @Output() public typing: any = new EventEmitter<boolean>()

  public messagesAfterTyping: IMessage[] = []
  private activeMessage: IMessage
  private readonly milliSecondsPerLetter: number = 70
  private readonly pausePerMessage: number = 400

  public ngOnInit() {
    // this.prepareAndTypeMessages();
  }

  public ngOnChanges() {
    this.messagesAfterTyping = []
    this.prepareAndTypeMessages()
  }

  private prepareAndTypeMessages() {
    if (this.messages.length === 0) {
      return
    }
    const texts: string[] = []
    if (!this.messages[0].fromChatBot) {
      this.messagesAfterTyping.push(this.messages[0])
    } else {
      for (const message of this.messages) {
        texts.push(message.text)
      }
      this.typeMessages(texts)
    }
  }

  private typeMessages(messages: string[]): number {

    if (messages === undefined || messages.length === 0) {
      return undefined
    }

    // this.typing.emit(true);
    let index = 0
    let duration = 0
    let completeMessage: any

    for (const message of messages) {
      setTimeout(() => {
        completeMessage = {
          fromChatBot: true,
          text: message,
        }
        duration = this.typeMessage(completeMessage, true)
      },         duration)
      duration += messages[index].length * 42 + this.pausePerMessage
      index += 1
    }

    setTimeout(() => {
      this.typing.emit(false)
    },         this.getTimeToWriteMessages(messages))

    return duration
  }
  private typeMessage(message: any, start?: boolean): number | undefined {

    if (message === undefined || message.text.length === 0) {
      return undefined
    }

    let i = 0

    document.getElementById('typeWriter').innerHTML += message.text.charAt(i)
    i += 1
    const rest: string = message.text.substring(i, message.text.length)
    setTimeout(() => {
      if (message.text.length > 0 && rest.length > 0) {
        this.typeMessage({ fromChatBot: message.fromChatBot, text: rest })
      } else {
        document.getElementById('typeWriter').innerHTML = ''
        this.messagesAfterTyping.push(this.activeMessage)
      }
    },         42)
    if (start) {
      this.activeMessage = message

      return message.text.length * this.milliSecondsPerLetter + 42
    }

    return undefined

  }

  private getTimeToWriteMessages(messages: string[]): number {
    let duration = 0
    for (const message of messages) {
      duration += message.length * this.milliSecondsPerLetter + this.pausePerMessage
    }

    return duration
  }

}
