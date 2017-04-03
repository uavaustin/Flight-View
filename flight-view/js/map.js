const path = require('path');

const remote = require('electron').remote;

const mapboxGL = require('mapbox-gl/dist/mapbox-gl');

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const MapboxMap = mapboxGL.Map;

const LOCAL_TILES = path.join(__dirname, '../..',
        '.data/map-cache-images/map-cache-{z}-{x}-{y}.jpg');

let satelliteSource = {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'
};

let satelliteLayer = {
    id: 'mapbox-satellite',
    source: 'mapbox-satellite',
    type: 'raster'
};

let cacheSource = {
    type: 'raster',
    tiles: [LOCAL_TILES]
};

let cacheLayer = {
    id: 'cache',
    source: 'cache',
    type: 'raster'
};

mapboxGL.accessToken = process.env.FV_MAPBOX_KEY;

class DashboardMap extends MapboxMap {
    constructor(containerID) {
        super({
            container: containerID,
            style: {
                version: 8,
                sources: {
                    'mapbox-satellite': satelliteSource
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background'
                    },
                    {
                        id: 'mapbox-satellite',
                        source: 'mapbox-satellite',
                        type: 'raster'
                    }
                ]
            }

        });

        this.useCache = false;
        this.cacheCount = 0;

        this.dragRotate.disable();

        let mapGeneralMenu = new Menu();

        mapGeneralMenu.append(new MenuItem({
            label: 'Cache Map',
            click: () => {
                let bounds = this.getBounds().toArray();

                console.log(bounds);

                this.fire('map-cache-request', {
                   zoom: this.getZoom(),
                   lat_1: bounds[1][1],
                   lon_1: bounds[0][0],
                   lat_2: bounds[0][1],
                   lon_2: bounds[1][0]
                });
            }
        }));

        mapGeneralMenu.append(new MenuItem({
            type: 'separator'
        }));

        mapGeneralMenu.append(new MenuItem({
            type: 'checkbox',
            label: 'Use Cache',
            click: () => {
                this.useCache = !this.useCache;

                if (this.useCache) this.showCache();
                else this.hideCache();
            }
        }));

        this.on('contextmenu', () => {
            mapGeneralMenu.popup(remote.getCurrentWindow());
        });

        this.on('error', (data) => {
            console.log(data);
        });
    }

    showCache() {
        this.removeLayer('mapbox-satellite')
        this.removeSource('mapbox-satellite');
        this.addSource('cache', cacheSource);
        this.addLayer(cacheLayer)
    }

    hideCache() {
        this.removeLayer('cache')
        this.removeSource('cache');
        this.addSource('mapbox-satellite', satelliteSource);
        this.addLayer(satelliteLayer);
    }

    drawFlyZone(auvsiMission) {
        let flyZones = auvsiMission.fly_zones;
        let coordinates = [[[]]];

        for (let i = 0; i < flyZones.length; i++) {
            for (let j = 0; j < flyZones[i].boundary_pts.length; j++) {
                coordinates[i][0].push([
                    flyZones[i].boundary_pts[j].longitude,
                    flyZones[i].boundary_pts[j].latitude
                ]);
            }

            coordinates[i][0].push([
                flyZones[i].boundary_pts[0].longitude,
                flyZones[i].boundary_pts[0].latitude
            ]);
        }

        if (this.getLayer('fly-zone') !== undefined) {
            this.removeLayer('fly-zone');
        }

        this.addLayer({
            id: 'fly-zone',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: coordinates
                    }
                }
            },
            layout:{
                'line-join': 'bevel'
            },
            paint: {
                'line-color': '#ff0000',
                'line-width': 4
            }
        });
    }

    drawSearchArea(auvsiMission) {
        let searchAreas = auvsiMission.search_grid_points;
        let coordinates = [[]];

        for (let i = 0; i < searchAreas.length; i++) {
            coordinates[0].push([
                searchAreas[i].longitude,
                searchAreas[i].latitude
            ]);
        }

        coordinates[0].push([
            searchAreas[0].longitude,
            searchAreas[0].latitude
        ]);

        if (this.getLayer('search-area') !== undefined) {
            this.removeLayer('search-area');
        }

        this.addLayer({
            id: 'search-area',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: coordinates
                    }
                }
            },
            layout:{
                'line-join': 'bevel'
            },
            paint: {
                'line-color': '#ffff00',
                'line-width': 4
            }
        });
    }
}

exports.DashboardMap = DashboardMap;
