import { Injectable } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiLeagueResponse } from '../interfaces';

@Injectable()
export class LeagueService {
  private readonly baseUrl: string;

  constructor(private readonly apiClient: ApiClientService) {
    this.baseUrl = '';
  }

  async getAll() {
    return this.apiClient.request<ApiLeagueResponse>(this.baseUrl, {});
  }
}
