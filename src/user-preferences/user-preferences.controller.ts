import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Post()
  create(@Body() createUserPreferenceDto: CreateUserPreferenceDto) {
    return this.userPreferencesService.create(createUserPreferenceDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.userPreferencesService.findAll(userId ? +userId : undefined);
  }

  @Get(':key')
  findOne(@Param('key') key: string, @Query('userId') userId?: string) {
    return this.userPreferencesService.findOne(key, userId ? +userId : undefined);
  }

  @Get(':key/value')
  getValue(@Param('key') key: string, @Query('userId') userId?: string, @Query('default') defaultValue?: string) {
    return this.userPreferencesService.getValue(key, userId ? +userId : undefined, defaultValue);
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
    @Query('userId') userId?: string,
  ) {
    return this.userPreferencesService.update(key, updateUserPreferenceDto, userId ? +userId : undefined);
  }

  @Delete(':key')
  remove(@Param('key') key: string, @Query('userId') userId?: string) {
    return this.userPreferencesService.remove(key, userId ? +userId : undefined);
  }
}

