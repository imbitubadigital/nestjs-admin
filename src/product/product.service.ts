import { Product } from './models/produc.entity';
import { AbstractService } from 'src/common/abstract.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends AbstractService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
}
