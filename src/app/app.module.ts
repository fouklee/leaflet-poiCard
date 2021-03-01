import { CartoModule } from "./carto/carto.module";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

@NgModule({
  imports: [BrowserModule, FormsModule, LeafletModule, CartoModule],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
