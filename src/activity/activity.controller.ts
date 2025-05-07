
import { Controller, Post, Body, UseGuards, Req, Get, Query, Param } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityFilterDto} from './dto/list-activity.dto';
import { SubmitReportDto } from './dto/submit-report.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  
  @UseGuards(JwtAuthGuard) // JWT Auth guard to protect the route
  @Get('filters')
  async getActivityFilters() {
    return this.activityService.getFilters();
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addActivity(@Body() dto: CreateActivityDto, @Req() req) {
    return this.activityService.createActivity(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllActivities(
    @Query() filterDto: ActivityFilterDto,
    @Req() req
  ) {
    return this.activityService.listActivities(req.user, filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notification')
  async getActivityNotifications(@Req() req: any) {
    const user = req.user as any;
    const result = await this.activityService.getActivityNotifications(user);
    return {
      success: 'true',
      message: 'Activity Notification',
      count: result.length,
      data: result,
    };
  }

  @Get('form')
@UseGuards(JwtAuthGuard) 
async getActivityForm(@Req() req) {
  return this.activityService.getActivityForm();
}

//activity Report Submit
@UseGuards(JwtAuthGuard)
@Post('report/submit/:activity_id')
async submitReport(
  @Param('activity_id') activityId: number,
  @Body() body: SubmitReportDto,
  @Req() req: any,
) {
  const userId = req.user.user_id;
  await this.activityService.submitReport(activityId, body, userId);
  return {
    success: "true",
    message: "Activity Report Submitted"
  };
}
  }

  {/***
      // activity.controller.ts
@UseGuards(JwtAuthGuard)
@Post('report/submit/:activity_id')
async submitReport(
  @Param('activity_id') activityId: number,
  @Body() body: SubmitReportDto,
  @Req() req: any,
) {
  const userId = req.user.user_id;
  await this.activityService.submitReport(activityId, body, userId);
  return {
    success: "true",
    message: "Activity Report Submitted"
  };
} */}