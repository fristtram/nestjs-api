import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Connection } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private connection: Connection;
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}
  // DTO: Ojecto de transferencia de dados
  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create({ amount: createOrderDto.amount });
  }

  findAll() {
    return this.orderModel.findAll();
  }

  findOne(id: string) {
    return this.orderModel.findByPk(id, { rejectOnEmpty: true });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderModel.findByPk(id, { rejectOnEmpty: true });
      order.update({ amount: updateOrderDto.amount });

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const order = await this.orderModel.findByPk(id, { rejectOnEmpty: true });
    order.destroy();
  }
}
