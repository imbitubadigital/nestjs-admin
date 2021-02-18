import { ProductUpdateDto } from './models/product-update.dto';
import { AuthGuard } from './../auth/auth.guard';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Product } from './models/produc.entity';
import { ProductCreateDto } from './models/product-create.dto';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.productService.paginate(Number(page));
  }

  @Post()
  async create(@Body() body: ProductCreateDto): Promise<Product> {
    return this.productService.create(body);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(Number(id));
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: ProductUpdateDto,
  ): Promise<Product> {
    await this.productService.update(Number(id), body);
    return this.productService.findOne(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(Number(id));
  }
}
