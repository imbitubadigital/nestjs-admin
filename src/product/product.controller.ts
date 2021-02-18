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
import { HasPermission } from 'src/permission/has-permisson.dedorator';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HasPermission('products')
  async all(@Query('page') page = 1) {
    return this.productService.paginate(Number(page));
  }

  @Post()
  @HasPermission('products')
  async create(@Body() body: ProductCreateDto): Promise<Product> {
    return this.productService.create(body);
  }

  @Get(':id')
  @HasPermission('products')
  async get(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(Number(id));
  }
  @Put(':id')
  @HasPermission('products')
  async update(
    @Param('id') id: string,
    @Body() body: ProductUpdateDto,
  ): Promise<Product> {
    await this.productService.update(Number(id), body);
    return this.productService.findOne(Number(id));
  }

  @Delete(':id')
  @HasPermission('products')
  async delete(@Param('id') id: string) {
    return this.productService.delete(Number(id));
  }
}
