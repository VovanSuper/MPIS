import { readFileSync, appendFileSync } from 'fs';
import { resolve } from 'path';
import { Controller, Get, Post, Body, Param, NotFoundException, Inject } from '@nestjs/common';
import { ServerRequest } from 'http';
import { EventDto } from '../../models/event.dto';
import { EventsService } from '../../services/';
import { Event } from '../../../../data/entities/';

@Controller('events')
export class EventsController {

  constructor(public eventsSvc: EventsService) {
    console.log(`[EventsCtrl]:: param eventsSvc --- ${this.eventsSvc}`)
    console.dir(this.eventsSvc === undefined)
    console.dir(this.eventsSvc.repo === undefined)
  }

  @Get()
  async getAll() {
    let data = await this.eventsSvc.repo.find();
    return {
      operationStatus: 'Found',
      data: data
    }
  }

  @Get(':id')
  async getById( @Param('id') id: string) {
    let event = await this.eventsSvc.repo.findOneById(id)
    if (!event)
      throw new NotFoundException(`No event with id ${id}`);

    return {
      operationStatus: 'Found',
      data: event
    }
  }

  @Post() create( @Body() req: EventDto) {
    // this.eventsSvc.repo.create(req)
    console.dir(req);
  }
}
