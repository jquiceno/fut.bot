import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { CLIENT_INSTANCE_PROVIDER_KEY } from '../constants';

@Injectable()
export class ApiClientService {
  constructor(
    @Inject(CLIENT_INSTANCE_PROVIDER_KEY)
    private readonly client: AxiosInstance,
  ) {}

  async request<ResponseType>(url = '', params = {}): Promise<ResponseType> {
    const { data } = await this.client.request({
      url,
      params,
    });

    return data;
  }
}
