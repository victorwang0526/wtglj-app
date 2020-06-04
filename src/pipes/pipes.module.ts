import { NgModule } from '@angular/core';
import { TaskPipe } from './task/task';
import { EnterpriseIndustryPipe } from './enterprise-industry/enterprise-industry';
import { EnterpriseFilterPipe } from './enterprise-filter/enterprise-filter';
@NgModule({
	declarations: [TaskPipe,
    EnterpriseIndustryPipe,
    EnterpriseFilterPipe],
	imports: [],
	exports: [TaskPipe,
    EnterpriseIndustryPipe,
    EnterpriseFilterPipe]
})
export class PipesModule {}
