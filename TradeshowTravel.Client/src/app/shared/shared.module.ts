import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell/app-shell.component';

export { Permissions, Role, ShowType } from './Enums';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [AppShellComponent]
})
export class SharedModule {}