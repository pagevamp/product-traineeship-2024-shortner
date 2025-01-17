import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const TO_AVOID = 'toAvoid';
export const Avoid = (): CustomDecorator<string> => SetMetadata(TO_AVOID, true);
