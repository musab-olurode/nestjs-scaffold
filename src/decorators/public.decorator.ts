import { SetMetadata } from '@nestjs/common';

// Decorator to make a presentation layer class or method public.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
