import { readFileSync, appendFileSync } from 'fs';
import { get } from 'config';
import { sign, decode, DecodeOptions } from "jsonwebtoken";
import { UsersService } from '../../shared/services/users.service';
import { UserDto } from '../../models/user.dto';
import { User } from '../../../data/entities/index';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  NotAcceptableException,
  Delete,
  Patch,
  BadRequestException,
  Request,
  Headers,
  UnprocessableEntityException,
  ForbiddenException
} from '@nestjs/common';

@Controller('users')
export class UsersController {

  constructor(public usersSvc: UsersService) { }

  @Get()
  async getAll() {
    let data = await this.usersSvc.repo.find();
    return {
      operationStatus: 'Found',
      data: data
    }
  }

  @Get(':id')
  async getById( @Param('id') id: string) {
    let user = await this.usersSvc.repo.findOneById(id)
    if (!user)
      throw new NotFoundException(`No event with id ${id}`);

    return {
      operationStatus: 'Found',
      data: user
    }
  }

  @Post()   // method for registering a very new user?
  async createUser( @Body() user: UserDto) {
    // if (user.fb_id)
    //   throw new BadRequestException('Wrong method', 'Patch method should rather be used to update fb_user');

    try {
      let newUser = await this.usersSvc.repo.insertOne(user);
    } catch (e) {
      console.log(`[users.ctrl->createUser()]:: ${JSON.stringify(e)}`);
    }
  }

  @Patch(':fb_id')
  async updateFbUser( @Param('fb_id') fb_id: number | string, @Body() userDto: UserDto) {

    console.log(`[users.ctrl->post()]:: userDto posted: ${userDto}`);
    try {
      let updatedUser = await this.usersSvc.repo
        .findOneAndUpdate({ 'fb_id': fb_id }, userDto, { upsert: true });

      return {
        operationStatus: 'Existing FbUser Patched with new data',
        data: updatedUser
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error saving User', e);
    }
  }

  // @Patch(':id') async patchById( @Param('id') id: string, @Body() userDto: UserDto) {
  //   let user = await this.usersSvc.repo.findOneById(id);
  //   if (!user)
  //     throw new NotFoundException(`No event with id ${id}`);

  //   await this.usersSvc.repo.updateById(id, userDto);
  //   return {
  //     operationStatus: 'Patched',
  //     data: `Succesfully pathced user ${id}`
  //   }
  // }

  @Delete(':id') async deleteById( @Param('id') id: string) {
    try {
      await this.usersSvc.repo.deleteById(id);
      return {
        operationStatus: `Succesfully Deleted`,
        data: `Deleted user ${id}`
      }
    } catch (e) {
      console.log(`[user.ctrl->DeleteById()]:: ${JSON.stringify(e)}`);
      throw new UnprocessableEntityException('Error deleting User', e);
    }
  }
}
