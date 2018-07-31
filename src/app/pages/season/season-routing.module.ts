import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { CommoditiesResolveService } from 'src/app/shared/services/resolvers/commodities-resolve.service';
import { VarietiesResolveService } from 'src/app/shared/services/resolvers/varieties-resolve.service';

const routes: Routes = [
    {
        path: 'new/field/:field', component: ManageComponent,
        resolve: {
            commodities: CommoditiesResolveService,
            varieties: VarietiesResolveService
        }
    },
    {
        path: ':season/edit', component: ManageComponent,
        resolve: {
            commodities: CommoditiesResolveService,
            varieties: VarietiesResolveService
        }
    },

    { path: 'new', component: ManageComponent },
    { path: '', redirectTo: 'new', pathMatch: 'full' },
    { path: '**', component: ManageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SeasonRoutingModule { }
