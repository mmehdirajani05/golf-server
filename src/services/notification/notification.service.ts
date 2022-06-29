/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MessageText } from 'src/constants/messages';

@Injectable()
export class NotificationService {


  async sendMatchInviteNotification(fcmToken: string | Array<string>) {
    const payload = {
      notification: { 
        body: MessageText.matchInvite, 
        title: MessageText.matchHeader
      },
    }
    try {
      const res = await admin.messaging().sendToDevice(fcmToken, payload);
      console.log(res.results)
    } catch(err) {
      return err;
    }
  }
}
