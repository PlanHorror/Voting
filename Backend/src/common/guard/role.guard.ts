import { CanActivate, Injectable } from '@nestjs/common';
import { Role } from '../enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private listRole: Role[]) {}
  canActivate(context: any): boolean {
    // return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || (!user.role && user.role !== 0)) {
      return false;
    }

    return this.listRole.some((role) => user.role === role);
  }
}
