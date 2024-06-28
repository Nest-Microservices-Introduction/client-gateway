import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      console.log('createORder GATE ', createOrderDto);
      const orderObservable = this.orderClient.send(
        'createOrder',
        createOrderDto,
      );
      const order = await firstValueFrom(orderObservable);
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orderObservable = this.orderClient.send(
        'findAllOrders',
        orderPaginationDto,
      );
      const order = await firstValueFrom(orderObservable);
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const orderObservable = this.orderClient.send('findOneOrder', {
        id: id,
      });
      const order = await firstValueFrom(orderObservable);
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const orderObservable = this.orderClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
      const order = await firstValueFrom(orderObservable);
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const orderObservable = this.orderClient.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
      const order = await firstValueFrom(orderObservable);
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
