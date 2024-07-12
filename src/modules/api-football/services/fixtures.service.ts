import { Injectable } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiFixturesResponse, FinFixturesQueryInterface } from '../interfaces';

const baseUrl = 'fixtures';

@Injectable()
export class FixtureService {
  constructor(private readonly apiClient: ApiClientService) {}

  async getBy(params: FinFixturesQueryInterface) {
    return this.apiClient.request<ApiFixturesResponse>(baseUrl, params);
  }
}
