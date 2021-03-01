import { PoiCardComponent } from "./poi-card/poi-card.component";
import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef
} from "@angular/core";
import {
  LatLngBounds,
  LeafletMouseEvent,
  Map,
  polygon,
  Polygon,
  svgOverlay,
  SVGOverlay,
  LatLngExpression,
  tileLayer
} from "leaflet";

import "leaflet-path-transform";
import "leaflet-path-drag";

@Component({
  selector: "carto",
  templateUrl: "./carto.component.html",
  styleUrls: ["./carto.component.css"]
})
export class CartoComponent {
  map: Map;
  svgOverlay: SVGOverlay;
  polygon: Polygon;

  constructor(
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  onMapClick(event: LeafletMouseEvent) {
    console.log(event.latlng);
  }

  onMapReady(map: Map) {
    if (!map) {
      throw Error("at-carto error : map not initialized");
    }
    this.map = map;
    tileLayer(
      "https://test.algotech.vision/api/rasters/7bf95392-6898-0f10-c1cd-e510a8e4b25b/{z}/{x}/{y}.png",
      {
        noWrap: true,
        tms: true,
        maxZoom: 4,
        minZoom: 2
      }
    ).addTo(map);

    this.map.setView([-75.7, -56.95], 3);
    this.map.invalidateSize(true);
    this.map.zoomControl.remove();

    const poly: LatLngExpression[] = [
      [-71.58747326430792, -52.73437500000001],
      [-74.02559147660332, -52.73437500000001],
      [-74.02559147660332, -38.14453125000001],
      [-71.58747326430792, -38.14453125000001]
    ];
    this.polygon = polygon(poly, {
      draggable: true,
      opacity: 0,
      fillOpacity: 0,
      color: "red"
    }).addTo(this.map);

    this.generateHTML();

    // -------------- ADD POI Card --------------
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", "0 0 100 100");
    // svgElement.innerHTML = `
    //   <rect width="200" height="200"/>
    //   <rect x="75" y="23" width="50" height="50" style="fill:red"/>new
    //   <rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>
    // `;
    svgElement.innerHTML = `
        <g>
            <foreignObject height="100px" width="100%">
                ${this.generateHTML()}
            </foreignObject>
        </g>
        `;
    let svgBounds: LatLngBounds = new LatLngBounds(
      [-71.58747326430792, -52.73437500000001],
      [-74.02559147660332, -38.14453125000001]
    );
    this.svgOverlay = svgOverlay(svgElement, svgBounds, {
      className: "poi-card"
    }).addTo(this.map);
    // -------------- ADD POI Card --------------

    this.polygon.on("dragstart", e => {
      console.log("dragstart");
    });
    this.polygon.on("drag", e => {
      this.svgOverlay.setBounds(this.polygon.getBounds());
    });
    this.polygon.on("dragend", e => {
      console.log("dragend");
      this.svgOverlay.setBounds(this.polygon.getBounds());
    });
  }

  generateHTML() {
    let html = "";
    const factory = this.resolver.resolveComponentFactory(PoiCardComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.hostView.detectChanges();
    html = component.location.nativeElement.innerHTML;
    component.destroy();
    console.log("HTML", html);
    return html;
  }
}
