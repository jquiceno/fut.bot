import { Test, TestingModule } from '@nestjs/testing';

import { ApiClientService, CLIENT_INSTANCE_PROVIDER_KEY } from '@api-football';

describe('ApiClientService', () => {
  let service: ApiClientService;
  const baseUrl = 'fixtures';
  const requestParams = { testParam: 1 };
  const clientResponseMock = { data: { test: true } };

  const clientMock = {
    request: jest.fn(() => clientResponseMock),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        {
          provide: CLIENT_INSTANCE_PROVIDER_KEY,
          useValue: clientMock,
        },
      ],
    }).compile();

    service = moduleRef.get<ApiClientService>(ApiClientService);
  });

  describe('When request method is called', () => {
    const testCases = [
      {
        description: 'When is called with params',
        responseExpected: clientResponseMock.data,
        requestParams: {
          baseUrl,
          params: requestParams,
        },
        clientCalledWith: {
          url: baseUrl,
          params: requestParams,
        },
      },
      {
        description: 'When is called only without params',
        responseExpected: clientResponseMock.data,
        requestParams: {
          baseUrl: undefined,
          params: undefined,
        },
        clientCalledWith: {
          url: baseUrl,
          params: requestParams,
        },
      },
      {
        description: 'When is called only with base url',
        responseExpected: clientResponseMock.data,
        requestParams: {
          baseUrl,
          params: undefined,
        },
        clientCalledWith: {
          url: baseUrl,
          params: requestParams,
        },
      },
    ];

    describe.each(testCases)('$description', ({ responseExpected, requestParams }) => {
      const { baseUrl, params } = requestParams;

      it('should return data response ', async () => {
        const response = await service.request(baseUrl, params);

        expect(response).toBe(responseExpected);
      });

      it('should call the client', () => {
        expect(clientMock.request).toHaveBeenCalledWith({
          url: baseUrl || '',
          params: params || {},
        });
      });
    });
  });
});
