import { CartoComponent } from './carto.component';
import { NgModule } from '@angular/core';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PoiCardComponent } from './poi-card/poi-card.component';

@NgModule({
    imports: [LeafletModule],
    declarations: [CartoComponent, PoiCardComponent],
    entryComponents: [PoiCardComponent],
    exports: [CartoComponent]
})
export class CartoModule { }
