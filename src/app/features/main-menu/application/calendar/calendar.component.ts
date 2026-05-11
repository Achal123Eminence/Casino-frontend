
import { MatSelectModule } from '@angular/material/select';
import { routes } from '../../../../shared/routes/routes';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CustomCalendarComponent } from '../../../common/custom-calendar/custom-calendar.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    imports: [MatSelectModule, BsDatepickerModule, CollapseHeaderComponent, RouterLink, CustomCalendarComponent]
})
export class CalendarComponent {
routes=routes

}

