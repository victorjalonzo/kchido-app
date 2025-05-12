import { Module} from '@nestjs/common'
import { PermissionService } from '../application/permission.service';
import { SharedModule } from 'src/Shared/shared.module';

@Module({
    imports: [SharedModule],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}