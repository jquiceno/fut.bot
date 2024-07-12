import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from '../../services';

describe('MatchesService', () => {
  let moduleRef: TestingModule;
  let service: MatchesService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = moduleRef.get<MatchesService>(MatchesService);
  });

  describe('When getAllBy date range', () => {
    describe('When is called without params', () => {
      it('Should return a list with current day matches', async () => {
        const matches = await service.getAllByDate();
        expect(Array.isArray(matches)).toBeTruthy();
      });

      it('Should return an empty list when there are not matches today', async () => {
        expect(true).toBe(false);
      });
    });

    describe('When is called with an initial date', () => {
      it('Should return a list with matches between the initial date and the end of the current day', async () => {
        expect(true).toBe(false);
      });

      it('Should return an empty list when there are not matches between initial date and the end of the current day', async () => {
        expect(true).toBe(false);
      });
    });

    describe('When is called with a range of dates', () => {
      it('Should return a list with matches between the initial date and the end date', async () => {
        expect(true).toBe(false);
      });

      it('Should return an empty list when there are not matches between initial date and the end date', async () => {
        expect(true).toBe(false);
      });
    });
    it('Should a list og matches with between 2 dates ', async () => {});
  });
});
