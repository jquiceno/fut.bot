import { Injectable } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiPredictionResponse } from '../interfaces';

const baseUrl = 'predictions';

@Injectable()
export class PredictionsService {
  constructor(private readonly apiClient: ApiClientService) {}

  async getByFixtureId(fixtureId: string) {
    return this.apiClient.request<ApiPredictionResponse>(baseUrl, {
      fixture: fixtureId,
    });
  }
}
