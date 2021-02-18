import { Product } from './models/produc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
