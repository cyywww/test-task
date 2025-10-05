import { Injectable } from '@nestjs/common';
import { Profile } from '../types';
import { CreateProfileDto } from './dto/create-profile.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfileService {
  private profiles: Profile[] = [];

  create(createProfileDto: CreateProfileDto): Profile {
    const profile: Profile = {
      id: uuidv4(),
      ...createProfileDto,
    };
    this.profiles.push(profile);
    return profile;
  }

  findAll(): Profile[] {
    return this.profiles;
  }

  findOne(id: string): Profile | undefined {
    return this.profiles.find((profile) => profile.id === id);
  }
}
