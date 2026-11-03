import { Module } from '@nestjs/common';
import { MisController } from './mis.controller';
import { MisService } from './mis.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MisController],
  providers: [MisService],
  exports: [MisService],
})
export class MisModule {}

