// src/adapters/ws.adapter.ts
import { WsAdapter as OriginWsAdapter } from '@nestjs/platform-ws';
import { MessageMappingProperties } from '@nestjs/websockets';
import {
  EMPTY,
  filter,
  fromEvent,
  mergeMap,
  Observable,
  share,
  takeUntil,
  take,                    // ✅ 添加 take
} from 'rxjs';
import { CLOSE_EVENT } from '@nestjs/websockets/constants';

enum READY_STATE {
  CONNECTING_STATE = 0,
  OPEN_STATE = 1,
  CLOSING_STATE = 2,
  CLOSED_STATE = 3,
}

export class WsAdapter extends OriginWsAdapter {
  public bindMessageHandlers(
    client: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    // 使用 take(1) 代替 first()
    const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), take(1));
    const source$ = fromEvent(client, 'message').pipe(
      mergeMap((data: any) => {
        let messageData: any = data.data;
        try {
          const parsed = JSON.parse(messageData.toString());
          messageData = parsed;
        } catch {
          messageData = messageData.toString();
        }

        const messageHandler = handlers.find(
          (handler) => handler.message === 'message',
        );
        if (!messageHandler) {
          return EMPTY;
        }

        const { callback } = messageHandler;
        const result$ = transform(callback(messageData));
        return result$.pipe(filter((result: any) => result));
      }),
      takeUntil(close$),
    );

    const onMessage = (response: any) => {
      if (client.readyState !== READY_STATE.OPEN_STATE) {
        return;
      }
      const payload = typeof response === 'string' ? response : JSON.stringify(response);
      client.send(payload);
    };

    source$.subscribe(onMessage);
  }
}