import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto, PaginationDto, UpdateProductDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const productObservable = this.productsClient.send(
        { cmd: 'create_product' },
        createProductDto,
      );
      const product = await firstValueFrom(productObservable);
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    const products = this.productsClient.send(
      { cmd: 'find_all_product' },
      paginationDto,
    );
    return products;
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    // try {
    //   const productObservable = this.productsClient.send(
    //     { cmd: 'find_one_product' },
    //     { id: id },
    //   );
    //   const product = await firstValueFrom(productObservable);
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
    return this.productsClient
      .send({ cmd: 'find_one_product' }, { id: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    try {
      const productObservable = this.productsClient.send(
        { cmd: 'update_product' },
        { id: id, ...body },
      );
      const product = await firstValueFrom(productObservable);
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
    return 'Patch id ' + body;
  }

  @Delete(':id')
  async removeProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const productObservable = this.productsClient.send(
        { cmd: 'remove_product' },
        { id: id },
      );
      const product = await firstValueFrom(productObservable);
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
