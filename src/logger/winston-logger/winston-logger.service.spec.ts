import { Test, TestingModule } from '@nestjs/testing';
import { logger } from '../../__mocks__/winston';
import { WinstonLoggerService } from './winston-logger.service';

describe('WinstonLoggerService', () => {
  let service: WinstonLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinstonLoggerService],
    }).compile();

    service = await module.resolve<WinstonLoggerService>(WinstonLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the context', () => {
    service.setContext('test');
    expect(service.context).toBe('test');
  });

  it('should add the context to the log message', () => {
    logger.info.mockClear();
    logger.error.mockClear();
    logger.warn.mockClear();

    service.setContext('test');

    service.log('message');
    expect(logger.info).toHaveBeenCalledWith(`[test] message`);

    service.error('message');
    expect(logger.error).toHaveBeenCalledWith(`[test] message`);

    service.warn('message');
    expect(logger.warn).toHaveBeenCalledWith(`[test] message`);
  });
});
