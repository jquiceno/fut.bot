import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG_PROVIDER_KEY } from '../constants';

@Injectable()
export class ApiClientService {
  constructor(
    @Inject(API_CONFIG_PROVIDER_KEY)
    private readonly config: any,
  ) {}

  getInstance(): AxiosInstance {
    return axios.create({
      method: 'get',
      baseURL: 'https://api-football-v1.p.rapidapi.com/v3/',
      headers: {
        'x-rapidapi-key': this.config.key,
        'x-rapidapi-host': this.config.host,
      },
    });
  }

  async request(url = '', params = {}) {
    const client = this.getInstance();

    const { data } = await client.request({
      url,
      params,
    });

    return data;
  }
}
