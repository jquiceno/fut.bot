import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchesService {
  async getAllByDate(intialDate?: Date, endDate?: Date) {
    return [];
  }
}
