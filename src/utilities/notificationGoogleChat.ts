/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { performance } from 'perf_hooks';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
// @ts-ignore
import * as moment from 'moment'
const chat = google.chat('v1');
export function notificationGoogleChat() {
  console.log('Init connection to Google Services...');
  var jwtClient = new JWT({
    email: process.env.GSERVICE_ACCOUNT_EMAIL,
    key: process.env.GSERVICE_ACCOUNT_KEY,
    scopes: [
      'https://www.googleapis.com/auth/chat.bot',
      'https://www.googleapis.com/auth/chat.messages',
      'https://www.googleapis.com/auth/chat.messages.create',
    ],
  });
  google.options({ auth: jwtClient });
  console.log('Done.');
  try {
    const generatedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    if (jwtClient) {
      console.log('Sending report to Google Chat...');
      chat.spaces.messages.create({
        parent: `spaces/${process.env.GSPACE_NAME}`,
        requestBody: {
          cards: [
            {
              header: {
                title: 'Monitoring Report',
                subtitle: `Generated from ${process.env.ORGAN_NAME} at ${generatedDate}`,
              },
              sections: [
                {
                  header: 'Global Monitoring Information',
                  widgets: [
                    {
                      keyValue: {
                        topLabel: 'State',
                        content: "Online",
                        bottomLabel: 'Platform State',
                      },
                    }
                  ],
                }
              ],
            },
          ],
        },
      });
    } else {
      console.log(
        'No Google Chat credentials found, skipping report sending...'
      );
    }
  } catch (e) {
    console.error('Error sending chat report:', e);
  }
}
