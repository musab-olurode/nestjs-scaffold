import { ValueTransformer } from 'typeorm';

export class CapitalizeTransformer implements ValueTransformer {
  to(data: string): string {
    return data && data.length > 0
      ? data.charAt(0).toUpperCase() + data.slice(1)
      : '';
  }

  from(data: string): string {
    return data && data.length > 0
      ? data.charAt(0).toUpperCase() + data.slice(1)
      : '';
  }
}
