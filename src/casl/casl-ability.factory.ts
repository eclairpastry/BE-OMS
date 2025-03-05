import { Ability, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly prisma: PrismaService,  private readonly authService: AuthService,) {}
  async createForUser(token: string): Promise<Ability> {
    const userId = await this.authService.extractUserIdFromToken(token);
    const { can, build } = new AbilityBuilder(Ability);

    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          role: {
            include: {
              permissions:{
                include:{
                  permissions: {
                    select: {
                      action: true,
                      name: true,
                    },
                  },
                }
              }
            },
          },
          subrole: {
            include: {
              permissions:{
                include:{
                  permissions: {
                    select: {
                      action: true,
                      name: true,
                    },
                  },
                }
              }
            },
          },
        },
      });

      if (!user || !user.role) {
        return build(); 
      }

      const allPermissions = [
        ...(user.role.permissions || []),
        ...(user.subrole?.permissions || []),
      ];

      allPermissions.forEach((permission) => {
        const [subject] = permission.permissions.name.split(' ').reverse();
        const action = permission.permissions.action
        can(action.toLowerCase(), subject.toLowerCase());
      });

      return build();
    } catch (error) {
      console.error('Error fetching user or permissions:', error);
      return build();
    }
}

}