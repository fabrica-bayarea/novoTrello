import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../guards/roles.guard'

@Controller('users')
@UseGuards(RolesGuard)
export class RolesUsersController {

  @Get('admin')
  @Roles('admin')
  getAdminData() {
    return { 
        message: 'ADMIN only access' 
    };
  }

  @Get('member')
  getMemberData() {
    return { 
        message: 'ADMIN and MEMBER can see this message' 
    };
  }

  @Get('observer')
  getObserverData() {
    return {
        message: "Every role can see this message"
    };
  }
}
