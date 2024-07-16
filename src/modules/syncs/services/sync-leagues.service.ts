import { Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { ApiClientService } from '../../api-football';

@Injectable()
export class SyncLeaguesService {
  constructor(
    private readonly apiClient: ApiClientService,
    private readonly firestore: Firestore,
  ) {}
  async run() {
    const collection = this.firestore.collection('leagues');

    const { response: leagues } = await this.apiClient.request<any>('leagues');

    for (const league of leagues) {
      const docRef = collection.doc(String(league.league.id));

      await docRef.set(league);
    }

    console.log('leagues', leagues.length);
  }
}
