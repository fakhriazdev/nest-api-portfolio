import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/security/authGuard';

@Controller('/api/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}

       @UseGuards(AuthGuard)
       @Post('/:id/update')
       async updateProfile(@Param('id') id: string, @Body() updateData: any) {
        const updatedProfile = await this.profileService.update(id, updateData);
        return updatedProfile;
    }
    
}
