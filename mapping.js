
function setUpGlobalVars() {

    // Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjZmFzdCIsImEiOiJjanVlbGRxbTUwNGVlNDlwcXRxNnFhYnlzIn0.-dc9uxSNW4TUYbC96E8zjA';

    // Initliaze base map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/secfast/cjupvuh6m155a1gqwh1d4ko6u',
      center: [-75.9, 42.9],
      zoom: 7,
      minZoom: 7,
      pitch: 0,
      bearing: 0,
    });

    // Initialize mapbox popup
    var popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: 70,
    });

    var open_popup = false;
    var hoveredStateId =  null;
    var censushoveredStateId =  null;
    var activeLayer = 'none';
    var satellite_view = false;

    var county_dict = {
                      'tompkins': ['mapbox://secfast.bxmtsg75',"tompkins-6devsn",[-76.5, 42.45],false],
                      'cayuga': ['mapbox://secfast.6ailnamb', "cayuga-dnav44",[-76.56, 42.93],false],
                      'cortland': ['mapbox://secfast.7u5fims4', "cortland-75081d",[-76.18, 42.60],false],
                      'sullivan': ['mapbox://secfast.3h6gzxg4', "sullivan-80f85m",[-74.72, 41.67],false],
                      'warren': ['mapbox://secfast.dt68zx9t', "warren-794izr",[-73.75, 43.61],false],
                      'rensselaer': ['mapbox://secfast.8iq39hbl', "rensselaer-6sdf3c",[-73.56, 42.67],false],
                      'ontario': ['mapbox://secfast.4jimwhnb', "ontario-2remdf",[-77.29, 42.85],false],
                      'greene': ['mapbox://secfast.99g3sjwx', "greene-dqr1u2",[-74.12, 42.30],false],
                      'lewis': ['mapbox://secfast.15o2ac0d', "lewis-6b0i9e",[-75.43, 43.84],false],
                      'genesee': ['mapbox://secfast.8074s81k', "genesee-5fjsw7",[-78.18, 43.00],false],
                      // 'onondaga': ['mapbox://secfast.aakb983p', "onondaga-bj1ko6",[-78.15, 43.05],false],
                      };

    // Load map
    map.on('load', function () {
        map.setLayoutProperty('landuse', 'visibility', 'none');
        map.setLayoutProperty('national_park', 'visibility', 'none');

        // Add satellite layer
        map.addLayer({
          id: 'satellite',
          source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
          type: "raster",
          layout: {
            'visibility': 'none'
          }
        },'admin-state-province');

        map.addSource('terrain',{
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
        map.addSource('school_zones',{
            type: 'vector',
            url: 'mapbox://secfast.5vs7dj3t'
        });
        map.addSource('empire_zones',{
            type: 'vector',
            url: 'mapbox://secfast.bhdyfqno'
        });
        map.addSource('senate',{
            type: 'vector',
            url: 'mapbox://secfast.59ncsd8l'
        });
        map.addSource('congress',{
            type: 'vector',
            url: 'mapbox://secfast.ax0xh5qg'
        });
        map.addSource('assembly',{
            type: 'vector',
            url: 'mapbox://secfast.5vwxb8ws'
        });
        map.addSource('villages',{
            type: 'vector',
            url: 'mapbox://secfast.52th248l'
        });
        map.addSource('counties',{
            type: 'vector',
            url: 'mapbox://secfast.0rhcbdxi'
        });
        map.addSource('indian_territory',{
            type: 'vector',
            url: 'mapbox://secfast.bc21xqhx'
        });
        map.addSource('city_town',{
            type: 'vector',
            url: 'mapbox://secfast.d1k5plil'
        });
        map.addSource('crops',{
            type: 'raster',
            url: 'mapbox://secfast.63qhbo2t',
            tileSize: 256
        });
        map.addSource('agriculture',{
            type: 'vector',
            url: 'mapbox://secfast.2euzzuud'
        });
        map.addSource('geology',{
            type: 'vector',
            url: 'mapbox://secfast.4cc0940p'
        });
        map.addSource('birds',{
            type: 'vector',
            url: 'mapbox://secfast.7o9su5kf'
        });
        map.addSource('precip',{
            type: 'vector',
            url: 'mapbox://secfast.4gi9cwh5'
        });
        map.addSource('soil',{
            type: 'vector',
            url: 'mapbox://secfast.1h9viy25'
        });
        map.addSource('census',{
            type: 'vector',
            url: 'mapbox://secfast.0fjc50cg'
        });
        map.addSource('zebra',{
            type: 'vector',
            url: 'mapbox://secfast.9qepxeqa'
        });


        map.addLayer({
          "id": 'zebra',
          "type": "symbol",
          "source": 'zebra',
          "source-layer": 'zebra_mussels-3pzz5l',
          "layout": {
            "icon-image": "marker-11",
          },
        },'admin-state-province');
        map.setLayoutProperty('zebra','visibility','none')

        map.addLayer({
          "id": 'terrain',
          "type": "line",
          "source": 'terrain',
          "source-layer": 'contour',
          "index": 1,
          "paint": {
            'line-width': 1,
            'line-opacity': .7,
          }
        },'admin-state-province');
        map.setLayoutProperty('terrain','visibility','none')
        map.addLayer({
          "id": 'terrain_label',
          "type": "symbol",
          "source": 'terrain',
          "source-layer": 'contour',
          "minZoom": 0,
          "layout": {
            "symbol-placement": "line",
            "text-field": ["concat",["to-string",["get","ele"]],"m (",["to-string",["*",["get","ele"],3.3]],"ft)"],
            "text-line-height": 2,
          },
          "paint": {
              "text-halo-width": 2,
              "text-halo-color": "rgba(255,255,255,255)",
          }

        },'admin-state-province');
        map.setLayoutProperty('terrain_label','visibility','none')
        map.addLayer({
          "id": 'crops',
          "type": "raster",
          "source": 'crops',
          "source-layer": 'CDL_2010_NY-7ym7gh',
        },'admin-state-province');
        map.setLayoutProperty('crops','visibility','none')
        map.addLayer({
          "id": 'agriculture',
          "type": "line",
          "source": 'agriculture',
          "source-layer": 'agriculture-913eim',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'agriculture_fill',
          "type": "fill",
          "source": 'agriculture',
          "source-layer": 'agriculture-913eim',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.setLayoutProperty('agriculture','visibility','none')
        map.addLayer({
          "id": 'birds',
          "type": "line",
          "source": 'birds',
          "source-layer": 'birds-0ixrxg',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'birds_fill',
          "type": "fill",
          "source": 'birds',
          "source-layer": 'birds-0ixrxg',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.setLayoutProperty('birds','visibility','none')
        map.addLayer({
          "id": 'precip',
          "type": "line",
          "source": 'precip',
          "source-layer": 'precip-0qg8b2',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'precip_fill',
          "type": "fill",
          "source": 'precip',
          "source-layer": 'precip-0qg8b2',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.setLayoutProperty('precip','visibility','none')
        map.addLayer({
          "id": 'geology',
          "type": "line",
          "source": 'geology',
          "source-layer": 'geology-7dpveh',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'geology_fill',
          "type": "fill",
          "source": 'geology',
          "source-layer": 'geology-7dpveh',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.setLayoutProperty('geology','visibility','none')
        map.addLayer({
          "id": 'soil',
          "type": "line",
          "source": 'soil',
          "source-layer": 'soil-0j12c4',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'soil_fill',
          "type": "fill",
          "source": 'soil',
          "source-layer": 'soil-0j12c4',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.setLayoutProperty('soil','visibility','none')
        map.addLayer({
          "id": 'census',
          "type": "line",
          "source": 'census',
          "source-layer": 'census_2-6uqqfb',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('census','visibility','none')
        map.addLayer({
          "id": 'census_fill',
          "type": "fill",
          "source": 'census',
          "source-layer": 'census_2-6uqqfb',
          "paint": {
            'fill-opacity': [
              "case",
              ["boolean", ["feature-state","hover"], false], .7,
              0
            ],
            'fill-color':'#FFB533'
          }
        },'admin-state-province');
        map.setLayoutProperty('census_fill','visibility','none')

        map.addLayer({
          "id": 'villages_fill',
          "type": "fill",
          "source": 'villages',
          "source-layer": 'villages-bnrwmd',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'villages',
          "type": "line",
          "source": 'villages',
          "source-layer": 'villages-bnrwmd',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('villages','visibility','none')

        map.addLayer({
          "id": 'city_town_fill',
          "type": "fill",
          "source": 'city_town',
          "source-layer": 'cities_towns-2uok5b',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'city_town',
          "type": "line",
          "source": 'city_town',
          "source-layer": 'cities_towns-2uok5b',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('city_town','visibility','none')

        map.addLayer({
          "id": 'counties_fill',
          "type": "fill",
          "source": 'counties',
          "source-layer": 'counties-7t5hf6',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'counties',
          "type": "line",
          "source": 'counties',
          "source-layer": 'counties-7t5hf6',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('counties','visibility','none')

        map.addLayer({
          "id": 'indian_territory_fill',
          "type": "fill",
          "source": 'indian_territory',
          "source-layer": 'indian_territory-4n30ds',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'indian_territory',
          "type": "line",
          "source": 'indian_territory',
          "source-layer": 'indian_territory-4n30ds',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('indian_territory','visibility','none')

        map.addLayer({
          "id": 'senate_fill',
          "type": "fill",
          "source": 'senate',
          "source-layer": 'senate-0213ch',
          "paint": {
            'fill-opacity': 0,
            'fill-color': [
              "match",
              ['get','party'],
              'Republican', 'red',
              'Democrat', 'blue',
              'grey',
            ]
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'senate',
          "type": "line",
          "source": 'senate',
          "source-layer": 'senate-0213ch',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('senate','visibility','none')
        // map.setLayoutProperty('senate_fill','visibility','none')
        map.addLayer({
          "id": 'congress_fill',
          "type": "fill",
          "source": 'congress',
          "source-layer": 'congress-962d2l',
          "paint": {
            'fill-opacity': 0,
            'fill-color': [
              "match",
              ['get','Party'],
              'Republican', 'red',
              'Democrat', 'blue',
              'grey',
            ]
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'congress',
          "type": "line",
          "source": 'congress',
          "source-layer": 'congress-962d2l',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('congress','visibility','none')
        // map.setLayoutProperty('congress_fill','visibility','none')
        map.addLayer({
          "id": 'assembly_fill',
          "type": "fill",
          "source": 'assembly',
          "source-layer": 'assembly-5wkkao',
          "paint": {
            'fill-opacity': 0,
            'fill-color': [
              "match",
              ['get','party'],
              'Republican', 'red',
              'Democrat', 'blue',
              'grey',
            ]
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'assembly',
          "type": "line",
          "source": 'assembly',
          "source-layer": 'assembly-5wkkao',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('assembly','visibility','none')
        // map.setLayoutProperty('assembly_fill','visibility','none')

        map.addLayer({
          "id": 'school_zones_fill',
          "type": "fill",
          "source": 'school_zones',
          "source-layer": 'school_zones-4v2mmg',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'school_zones',
          "type": "line",
          "source": 'school_zones',
          "source-layer": 'school_zones-4v2mmg',
          "paint": {
            'line-width': 2,
          }
        },'admin-state-province');
        map.setLayoutProperty('school_zones','visibility','none')

        map.addLayer({
          "id": 'empire_zones_fill',
          "type": "fill",
          "source": 'empire_zones',
          "source-layer": 'empirezone-ah3phb',
          "paint": {
            'fill-opacity': 0,
          }
        },'admin-state-province');
        map.addLayer({
          "id": 'empire_zones',
          "type": "line",
          "source": 'empire_zones',
          "source-layer": 'empirezone-ah3phb',
          "paint": {
            'line-width': 1,
          }
        },'admin-state-province');
        map.setLayoutProperty('empire_zones','visibility','none')

        // Add county layers
        for (var key in county_dict) {
            map.addSource(key,{
                type: 'vector',
                url: county_dict[key][0]
            });

            // Add fill layer for satellite view
            map.addLayer({
              "id": key+"_fill_outlines",
              "type": "fill",
              "source": key,
              "source-layer": county_dict[key][1],
              'minzoom': 0,
              "paint": {
                'fill-opacity': [
                "case",
                ["boolean", ["feature-state","hover"], false], .7,
                0],
                'fill-outline-color': '#FFB533',
                'fill-color': '#FFB533',
              }
            },'admin-state-province');
            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');

            // Add fill layer for normal view
            map.addLayer({
              "id": key+"_fills",
              "type": "fill",
              "source": key,
              "source-layer": county_dict[key][1],
              'minzoom': 0,
              "paint": {
                  'fill-opacity': .7,
                  'fill-outline-color': 'black',
                  'fill-color': [
                          "case",
                            ["boolean", ["feature-state","hover"], false],
                            '#ff69b4',
                          [
                          'interpolate', ['linear'],['get','FULL_MV'],
                            0, '#18a9ec',
                            50000, '#5ae7e5',
                            100000, '#5ae79e',
                            300000, '#b1e75a',
                            600000, '#e7cd5a',
                            800000, '#e7925a',
                            1200000, '#e7875a',
                            5000000, '#e75a5a',
                          ]
                          ],
                },
            },'water');
            map.setLayoutProperty(key+'_fills', 'visibility', 'none');

            // Add outline layer for satellite view
            map.addLayer({
              "id": key+"_outlines",
              "type": "line",
              "source": key,
              "source-layer": county_dict[key][1],
              'minzoom': 0,
              "paint": {
                // 'line-color': '#FFB533',
                'line-width': .7,
              }
            },'admin-state-province');
            map.setPaintProperty(key+'_outlines', 'line-color', 'black');
            // },key+'_fills');
            map.setLayoutProperty(key+'_outlines', 'visibility', 'none');


        };

        // Add 3D buildings
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 12,
            'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': 8,
            'fill-extrusion-opacity': .6
            }
        }, 'water');


        var checkMapLayer = map.getLayer('3d-buildings');
        var census_clicked = false;
        // Display property features when fill layer parcels are clicked
        map.on('click', function (e) {
            var lngLat = e.lngLat;
            let f = map.queryRenderedFeatures(e.point);
            console.log(f);
            if (f.length && (typeof checkMapLayer !== 'undefined')) {
                census_clicked = false;
                for (i=0; i<f.length; i++) {
                    if (f[i].layer.id.includes('census_fill')) {
                        census_clicked = true;
                    }
                    if (f[i].layer.id.includes('fills') || f[i].layer.id.includes('_fill_outlines')) {
                        if (map.getLayoutProperty(activeLayer+'_fills','visibility') == 'visible' || map.getLayoutProperty(activeLayer+'_fill_outlines','visibility') == 'visible') {
                            if (map.getLayoutProperty('census_fill', 'visibility') != 'visible') popup.remove();
                            if (hoveredStateId) {
                                map.setFeatureState({source: activeLayer, id: hoveredStateId, sourceLayer: county_dict[activeLayer][1]}, {hover: false});
                            };
                            map.getCanvas().style.cursor = '';
                            hoveredStateId =  null;
                        };
                        new_popup = makePopUp(map,f[i],lngLat);
                        open_popup = true;
                    };
                };
            };
        });

        // Make parcel appear purple when hovered with mouse
        map.on("mousemove", function(e) {
            if (open_popup) {
                if (!new_popup.isOpen()) {
                    open_popup = false;
                };
            } else if (typeof checkMapLayer !== 'undefined') {
                let f = map.queryRenderedFeatures(e.point);
                var on_fills = false;
                var on_census = false;
                var county = false;
                var city = false;
                var village = false;
                var school = false;
                var indian = false;
                var senate = false;
                var congress = false;
                var assembly = false;
                if (f.length) {
                    for (i=0; i<f.length; i++) {
                        // if (f[i].layer.id == 'counties_fill') {
                        //     info += f[i].properties.NAME + 'County\n'
                        // }

                        if (f[i].layer.id == 'city_town_fill') {
                            county = true;
                            var county_name = f[i].properties.COUNTY;
                            var city_name = f[i].properties.NAME;
                        }
                        if (f[i].layer.id == 'villages_fill') {
                            village = true;
                            var village_name = f[i].properties.NAME;
                        }
                        if (f[i].layer.id == 'school_zones_fill') {
                            school = true;
                            var school_name = f[i].properties.NAME;
                        }
                        if (f[i].layer.id == 'indian_territory_fill') {
                            indian = true;
                            var indian_name = f[i].properties.NAME;
                        }
                        if (f[i].layer.id == 'senate_fill') {
                            senate = true;
                            var string = f[i].properties.DISTRICT.toString()
                            string.charAt(string.length - 1)
                            if (string.charAt(string.length - 1) == '2') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'nd';
                              }
                            } else if (string.charAt(string.length - 1) == '3') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'rd';
                              }
                            } else if (string.charAt(string.length - 1) == '1') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'st';
                              }
                            } else {
                              var ending = 'th';
                            }
                            var senate_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.party[0]+'.)';
                        }
                        if (f[i].layer.id == 'congress_fill') {
                            congress = true;
                            var string = f[i].properties.DISTRICT.toString()
                            string.charAt(string.length - 1)
                            if (string.charAt(string.length - 1) == '2') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'nd';
                              }
                            } else if (string.charAt(string.length - 1) == '3') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'rd';
                              }
                            } else if (string.charAt(string.length - 1) == '1') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'st';
                              }
                            } else {
                              var ending = 'th';
                            }
                            var congress_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.Party[0]+'.)';
                        }
                        if (f[i].layer.id == 'assembly_fill') {
                            assembly = true;
                            var string = f[i].properties.DISTRICT.toString()
                            string.charAt(string.length - 1)
                            if (string.charAt(string.length - 1) == '2') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'nd';
                              }
                            } else if (string.charAt(string.length - 1) == '3') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'rd';
                              }
                            } else if (string.charAt(string.length - 1) == '1') {
                              if (string.charAt(string.length - 2) == '1') {
                                  var ending = 'th';
                              } else {
                                  var ending = 'st';
                              }
                            } else {
                              var ending = 'th';
                            }
                            var assembly_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.party[0]+'.)';
                        }




                        if (f[i].layer.id.includes('fills') || f[i].layer.id.includes('_fill_outlines')) {
                            on_fills = !on_fills;
                            var layer_id = f[i].layer.id.replace('_fills','').replace('_fill_outlines','').replace('_outlines','');
                            if (hoveredStateId) {
                                map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, {hover: false});
                            };
                            // Display parcel information when hovered
                            map.getCanvas().style.cursor = 'pointer';

                            var address = f[i].properties.PARCELADDR;
                            var parcel_id = f[i].properties.PRINT_KEY;
                            var assessed_value = f[i].properties.FULL_MV.toString();
                            var length = assessed_value.length;

                            if (length > 9) {
                                var assessed_value = assessed_value.slice(0,length-9) + ',' + assessed_value.slice(length-9,length-6) + ',' + assessed_value.slice(length-6,length-3) + ',' + assessed_value.slice(length-3,length);
                            } else if (length > 6) {
                                var assessed_value = assessed_value.slice(0,length-6) + ',' + assessed_value.slice(length-6,length-3) + ',' + assessed_value.slice(length-3,length);
                            } else if (length > 3) {
                                var assessed_value = assessed_value.slice(0,length-3) + ',' + assessed_value.slice(length-3,length);
                            } else {
                                var assessed_value = assessed_value;
                            };

                            popup.setLngLat(e.lngLat)
                                .setHTML("<p style='font-size:140%;'>"+address+"</p><p style='font-size:120%;'>"+"<u>Assessed Value:</u> $"+assessed_value+"*</p><p style='font-size:100%;'>"+"<u>Parcel ID:</u> "+parcel_id+"</p><p style='font-size:90%;'>*May not reflect market value</p>")
                                .addTo(map);

                            // var listings = document.getElementById('listings');
                            // var details = listing.appendChild(document.createElement('div'));

                            hoveredStateId = f[i].id;
                            map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, {hover: true});
                            // break;
                        };

                        if (f[i].layer.id.includes('census_fill')) {
                            on_census = !on_census;
                            if (censushoveredStateId) {
                                map.setFeatureState({source: 'census', id: censushoveredStateId, sourceLayer: 'census_2-6uqqfb'}, {hover: false});
                            };
                            map.getCanvas().style.cursor = 'pointer';

                            // google.charts.load("current", {packages:["corechart"]});
                            tot_pop = f[i].properties.POP2000;
                            var other = f[i].properties.OTHER + f[i].properties.HAWN_PI + f[i].properties.MULT_RACE + f[i].properties.AMERI_ES;
                            var data1 = google.visualization.arrayToDataTable([
                              ['Race', 'Race'],
                              ['White',     +((f[i].properties.WHITE/tot_pop).toFixed(2))],
                              ['Black',      +((f[i].properties.BLACK/tot_pop).toFixed(2))],
                              ['Hispanic',  +((f[i].properties.HISPANIC/tot_pop).toFixed(2))],
                              ['Asian', +((f[i].properties.ASIAN/tot_pop).toFixed(2))],
                              ['Other',    +((other/tot_pop).toFixed(2))]
                            ]);

                            var data2 = google.visualization.arrayToDataTable([
                              ['Age', 'Age'],
                              ['Under 5',     f[i].properties.AGE_UNDER5],
                              ['5 - 17',      f[i].properties.AGE_5_17],
                              ['18 - 21',  f[i].properties.AGE_18_21],
                              ['22 - 29', f[i].properties.AGE_22_29],
                              ['30 - 39',    f[i].properties.AGE_30_39],
                              ['40 - 49',    f[i].properties.AGE_40_49],
                              ['50 - 64',    f[i].properties.AGE_50_64],
                              ['Above 65',    f[i].properties.AGE_65_UP],
                            ]);
                            var options1 = {
                              title: 'Demographics',
                              pieHole: 0.4,
                              legend: {position: 'labeled'},
                              pieSliceText: 'none',
                            };
                            var options2 = {
                              title: 'Age',
                              legend: 'none',
                            };

                            div = document.createElement('div');
                            div.innerHTML = '<div id="chart_holder" align="center" style="float: left; width: 300px; height: 300px;"></div>'
                            div1 = document.createElement('div');
                            div2 = document.createElement('div');
                            div1.innerHTML = '<div id="donutchart1" style="width: 250px; height: 150px;"></div>'
                            div2.innerHTML = '<div id="donutchart2" style="width: 250px; height: 150px;"></div>'
                            div.appendChild(div1);
                            div.appendChild(div2);
                            var chart1 = new google.visualization.PieChart(div1);
                            var chart2 = new google.visualization.BarChart(div2);
                            popup.setLngLat(e.lngLat)
                                .setDOMContent(div)
                                .addTo(map);
                                censushoveredStateId = f[i].id;
                                map.setFeatureState({source: 'census', id: censushoveredStateId, sourceLayer: 'census_2-6uqqfb'}, {hover: true});

                            chart1.draw(data1, options1);
                            chart2.draw(data2, options2);
                        };
                    };

                    if (!on_fills) {
                        if (activeLayer != 'none') {
                            if (map.getLayoutProperty(activeLayer+'_fills','visibility') == 'visible' || map.getLayoutProperty(activeLayer+'_fill_outlines','visibility') == 'visible') {
                                if (hoveredStateId) {
                                    map.setFeatureState({source: activeLayer, id: hoveredStateId, sourceLayer: county_dict[activeLayer][1]}, {hover: false});
                                };
                                map.getCanvas().style.cursor = '';
                                hoveredStateId =  null;
                                popup.remove();
                            };
                        };
                    };
                    if (!on_census) {
                        if (map.getLayoutProperty('census_fill','visibility') == 'visible') {
                            if (censushoveredStateId) {
                                map.setFeatureState({source: 'census', id: censushoveredStateId, sourceLayer: 'census_2-6uqqfb'}, {hover: false});
                            };
                            map.getCanvas().style.cursor = '';
                            censushoveredStateId =  null;
                            if (!census_clicked) {
                                popup.remove();
                            };
                        };
                    };
                };
                if (county) {
                    element = document.getElementById('county');
                    element.innerHTML = county_name;
                    element = document.getElementById('city');
                    element.innerHTML = city_name;
                } else {
                    element = document.getElementById('county');
                    element.innerHTML = '-';
                    element = document.getElementById('city');
                    element.innerHTML = '-';
                }
                if (village) {
                    element = document.getElementById('village');
                    element.innerHTML = village_name;
                } else {
                    element = document.getElementById('village');
                    element.innerHTML = '-';
                }
                if (school) {
                    element = document.getElementById('school');
                    element.innerHTML = school_name;
                } else {
                    element = document.getElementById('school');
                    element.innerHTML = '-';
                }
                if (indian) {
                    element = document.getElementById('indian');
                    element.innerHTML = indian_name;
                } else {
                    element = document.getElementById('indian');
                    element.innerHTML = '-';
                }
                if (senate) {
                    element = document.getElementById('senate');
                    element.innerHTML = senate_name;
                } else {
                    element = document.getElementById('senate');
                    element.innerHTML = '-';
                }
                if (congress) {
                    element = document.getElementById('congress');
                    element.innerHTML = congress_name;
                } else {
                    element = document.getElementById('congress');
                    element.innerHTML = '-';
                }
                if (assembly) {
                    element = document.getElementById('assembly');
                    element.innerHTML = assembly_name;
                } else {
                    element = document.getElementById('assembly');
                    element.innerHTML = '-';
                }
            };
        });
    });


    // Toggle satellite mode when clicked
    var toggleableLayerIds = ['Satellite View','Crop Cover','Counties','Cities','Villages','Indian Territory','School Zones','Census Data','Congressional Districts','State Senate','State Assembly','Empire Zone Program','Agricultural Districts','Soil Info','Terrain','Precipitation','Geology','Bird Migration','Zebra Mussels'];
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = function (e) {
            var checkMapLayer = map.getLayer('3d-buildings');
            if (typeof checkMapLayer !== 'undefined') {
                if (this.textContent == 'Satellite View') {
                    satellite_view = !satellite_view;
                    var clickedLayer = 'satellite';
                } else if (this.textContent == 'Counties') {
                    var clickedLayer = 'counties';
                } else if (this.textContent == 'Cities') {
                    var clickedLayer = 'city_town';
                } else if (this.textContent == 'Villages') {
                    var clickedLayer = 'villages';
                } else if (this.textContent == 'Indian Territory') {
                    var clickedLayer = 'indian_territory';
                } else if (this.textContent == 'School Zones') {
                    var clickedLayer = 'school_zones';
                } else if (this.textContent == 'Empire Zone Program') {
                    var clickedLayer = 'empire_zones';
                } else if (this.textContent == 'Census Data') {
                    var clickedLayer = 'census';
                } else if (this.textContent == 'Crop Cover') {
                    var clickedLayer = 'crops';
                } else if (this.textContent == 'Agricultural Districts') {
                    var clickedLayer = 'agriculture';
                } else if (this.textContent == 'Geology') {
                    var clickedLayer = 'geology';
                } else if (this.textContent == 'Bird Migration') {
                    var clickedLayer = 'birds';
                } else if (this.textContent == 'Zebra Mussels') {
                    var clickedLayer = 'zebra';
                } else if (this.textContent == 'Precipitation') {
                    var clickedLayer = 'precip';
                } else if (this.textContent == 'Terrain') {
                    var clickedLayer = 'terrain';
                } else if (this.textContent == 'Soil Info') {
                    var clickedLayer = 'soil';
                } else if (this.textContent == 'State Senate') {
                    var clickedLayer = 'senate';
                    if (map.getPaintProperty('senate_fill', 'fill-opacity') != .25) {
                        map.setPaintProperty('senate_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('senate_fill', 'fill-opacity', 0)
                    };
                } else if (this.textContent == 'Congressional Districts') {
                    var clickedLayer = 'congress';
                    if (map.getPaintProperty('congress_fill', 'fill-opacity') != .25) {
                        map.setPaintProperty('congress_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('congress_fill', 'fill-opacity', 0)
                    };
                } else if (this.textContent == 'State Assembly') {
                    var clickedLayer = 'assembly';
                    if (map.getPaintProperty('assembly_fill', 'fill-opacity') != .25) {
                        map.setPaintProperty('assembly_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('assembly_fill', 'fill-opacity', 0)
                    };
                } else {
                    var clickedLayer = this.textContent;
                };
                e.preventDefault();
                e.stopPropagation();

                if (activeLayer != 'none') {
                    var layer_id = activeLayer;
                } else {
                    var layer_id = 'none';
                };

                if (map.getLayoutProperty(clickedLayer, 'visibility') === 'visible') {
                    if (clickedLayer == 'terrain') {
                        map.setLayoutProperty('terrain_label', 'visibility', 'none');
                    };

                    if (clickedLayer == 'census') {
                        map.setLayoutProperty('census_fill', 'visibility', 'none');
                    };

                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    if (map.getLayoutProperty('satellite', 'visibility') === 'visible') {
                        map.setPaintProperty('school_zones','line-color','orange');
                        map.setPaintProperty('senate','line-color','orange');
                        map.setPaintProperty('congress','line-color','orange');
                        map.setPaintProperty('assembly','line-color','orange');
                        map.setPaintProperty('empire_zones','line-color','orange');
                        map.setPaintProperty('villages','line-color','orange');
                        map.setPaintProperty('city_town','line-color','orange');
                        map.setPaintProperty('counties','line-color','orange');
                        map.setPaintProperty('indian_territory','line-color','orange');
                        map.setPaintProperty('geology','line-color','orange');
                        map.setPaintProperty('agriculture','line-color','orange');
                        map.setPaintProperty('birds','line-color','orange');
                        map.setPaintProperty('census','line-color','orange');
                        map.setPaintProperty('precip','line-color','orange');
                        map.setPaintProperty('soil','line-color','orange');
                        map.setPaintProperty('terrain','line-color','orange');
                    } else {
                        map.setPaintProperty('school_zones','line-color','purple');
                        map.setPaintProperty('senate','line-color','black');
                        map.setPaintProperty('congress','line-color','black');
                        map.setPaintProperty('assembly','line-color','black');
                        map.setPaintProperty('empire_zones','line-color','black');
                        map.setPaintProperty('villages','line-color','black');
                        map.setPaintProperty('city_town','line-color','black');
                        map.setPaintProperty('counties','line-color','black');
                        map.setPaintProperty('indian_territory','line-color','black');
                        map.setPaintProperty('geology','line-color','black');
                        map.setPaintProperty('agriculture','line-color','black');
                        map.setPaintProperty('birds','line-color','black');
                        map.setPaintProperty('census','line-color','black');
                        map.setPaintProperty('precip','line-color','black');
                        map.setPaintProperty('soil','line-color','black');
                        map.setPaintProperty('terrain','line-color','black');
                    };
                    if (layer_id != 'none' && clickedLayer == 'satellite') {
                        // map.setPaintProperty('school_zones','line-color','black');
                        if (map.getLayoutProperty(layer_id+'_fills', 'visibility') == 'visible') {
                            map.setLayoutProperty(layer_id+'_fills', 'visibility', 'none');
                            map.setLayoutProperty(layer_id+'_fill_outlines', 'visibility', 'visible');
                        } else if (map.getLayoutProperty(layer_id+'_fill_outlines', 'visibility') == 'visible') {
                            map.setLayoutProperty(layer_id+'_fills', 'visibility', 'visible');
                            map.setLayoutProperty(layer_id+'_fill_outlines', 'visibility', 'none');
                        };
                        map.setPaintProperty(layer_id+'_outlines', 'line-color', 'black');
                    };
                    this.className = 'active';

                } else {
                    if (clickedLayer == 'terrain') {
                        map.setLayoutProperty('terrain_label', 'visibility', 'visible');
                        map.flyTo({
                            center: [-74.2, 44.13],
                            zoom: 13,
                            pitch: 10,
                            bearing: 0,
                        });
                    };
                    if (clickedLayer == 'census') {
                        map.setLayoutProperty('census_fill', 'visibility', 'visible');
                    };
                    if (clickedLayer == 'agriculture') {
                        map.flyTo({
                            center: [-75.9, 42.9],
                            zoom: 8.5,
                            pitch: 10,
                            bearing: 0,
                        });
                    };

                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    if (map.getLayoutProperty('satellite', 'visibility') === 'visible') {
                        map.setPaintProperty('school_zones','line-color','orange');
                        map.setPaintProperty('senate','line-color','orange');
                        map.setPaintProperty('congress','line-color','orange');
                        map.setPaintProperty('assembly','line-color','orange');
                        map.setPaintProperty('empire_zones','line-color','orange');
                        map.setPaintProperty('villages','line-color','orange');
                        map.setPaintProperty('city_town','line-color','orange');
                        map.setPaintProperty('counties','line-color','orange');
                        map.setPaintProperty('indian_territory','line-color','orange');
                        map.setPaintProperty('geology','line-color','orange');
                        map.setPaintProperty('agriculture','line-color','orange');
                        map.setPaintProperty('birds','line-color','orange');
                        map.setPaintProperty('census','line-color','orange');
                        map.setPaintProperty('precip','line-color','orange');
                        map.setPaintProperty('soil','line-color','orange');
                        map.setPaintProperty('terrain','line-color','orange');
                    } else {
                        map.setPaintProperty('school_zones','line-color','purple');
                        map.setPaintProperty('senate','line-color','black');
                        map.setPaintProperty('congress','line-color','black');
                        map.setPaintProperty('assembly','line-color','black');
                        map.setPaintProperty('empire_zones','line-color','black');
                        map.setPaintProperty('villages','line-color','black');
                        map.setPaintProperty('city_town','line-color','black');
                        map.setPaintProperty('counties','line-color','black');
                        map.setPaintProperty('indian_territory','line-color','black');
                        map.setPaintProperty('geology','line-color','black');
                        map.setPaintProperty('agriculture','line-color','black');
                        map.setPaintProperty('birds','line-color','black');
                        map.setPaintProperty('census','line-color','black');
                        map.setPaintProperty('precip','line-color','black');
                        map.setPaintProperty('soil','line-color','black');
                        map.setPaintProperty('terrain','line-color','black');
                    };
                    if (layer_id != 'none' && clickedLayer == 'satellite') {
                        // map.setPaintProperty('school_zones','line-color','orange');
                        map.setLayoutProperty(layer_id+'_fill_outlines', 'visibility', 'visible');
                        map.setLayoutProperty(layer_id+'_outlines', 'visibility', 'visible');
                        map.setLayoutProperty(layer_id+'_fills', 'visibility', 'none')
                        map.setPaintProperty(layer_id+'_outlines', 'line-color', 'orange');
                    };
                    this.className = 'inactive';
                };
            };
        };
        var layers = document.getElementById('menu');
        layers.appendChild(link);
    };

    // Handle input from county selection dropdown
    window.onclick = function(e) {
        var checkMapLayer = map.getLayer('3d-buildings');
        if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show');
            };
        };
        if ((typeof checkMapLayer !== 'undefined') && e.composedPath()[2].matches('.dropdown')) {
            for (var key in county_dict) {
                if (e.toElement.text.toLowerCase() == key) {
                    activeLayer = key;
                    // Change layer to be visible and fly to given coordinates
                    if (satellite_view) {
                        if (map.getLayoutProperty(key+'_fill_outlines', 'visibility') == 'visible') {
                            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'none');
                            map.setPaintProperty(key+'_outlines', 'line-color', 'orange');
                        } else {
                            map.flyTo({
                                center: county_dict[key][2],
                                zoom: 12,
                                pitch: 10,
                                bearing: 0,
                            });
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'visible');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'visible');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'visible');
                            map.setPaintProperty(key+'_outlines', 'line-color', 'orange');
                        };
                    } else {
                        if (map.getLayoutProperty(key+'_fills', 'visibility') == 'visible') {
                            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'none');
                            map.setPaintProperty(key+'_outlines', 'line-color', 'black');
                        } else {
                            map.flyTo({
                                center: county_dict[key][2],
                                zoom: 12,
                                pitch: 10,
                                bearing: 0,
                            });
                            map.setLayoutProperty(key+'_fills', 'visibility', 'visible');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'visible');
                        };
                    };
                } else {
                    map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                    map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                    map.setLayoutProperty(key+'_outlines', 'visibility', 'none');
                };
            };
        };
    };
};


// Pop-up for when parcel is clicked
function makePopUp(map,e,lngLat,county_dict) {
    var features = e.properties;
    var street_view_url = "http://maps.google.com/?cbll="+lngLat.lat+","+lngLat.lng+"&cbp=12,20.09,,0,5&layer=c"
    var value_item = features['FULL_MV'].toString();
    var length = value_item.length;

    // Show value if information exists
    if (features['YR_BLT'] == 0) {
        var year_built = '-';
    } else {
        var year_built = features['YR_BLT'];
    };

    // Show value if information exists
    if (features['SQFT_LIV'] == 0) {
        var square_feet = '-';
    } else {
        var num_length = features['SQFT_LIV'].toString().length;
        if (num_length > 3) {
            var square_feet = features['SQFT_LIV'].toString().slice(0,num_length-3) + ',' + features['SQFT_LIV'].toString().slice(num_length-3,num_length);
        } else {
            var square_feet = features['SQFT_LIV'];
        };
    };

    // Format property value assessment
    if (length > 9) {
        var market_value = value_item.slice(0,length-9) + ',' + value_item.slice(length-9,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
    } else if (length > 6) {
        var market_value = value_item.slice(0,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
    } else if (length > 3) {
        var market_value = value_item.slice(0,length-3) + ',' + value_item.slice(length-3,length);
    } else {
        var market_value = value_item;
    };

    // Show value if information exists
    if (features['NBR_BEDRM'] == 0) {
        var beds = '-';
    } else {
        var beds = features['NBR_BEDRM'];
    };

    // Show value if information exists
    if (features['NBR_F_BATH'] == 0) {
        var baths = '-';
    } else {
        var baths = features['NBR_F_BATH'];
    };
    var popup = new mapboxgl.Popup({closeButton: true,closeOnClick: true})
                .setLngLat(lngLat)
                .setHTML(
                        '<h3><u>Address:</u> '+features['PARCELADDR']+'</h3>\n'+
                        '<h3><u>Parcel ID:</u> '+features['PRINT_KEY']+'</h3>\n'+
                        '<h3><u>Assessed Value:</u> $'+market_value+'</h3>\n'+
                        '<h3><u>Acres:</u> '+Math.round(features['CALC_ACRES']*100) / 100+'</h3>\n'+
                        '<h3><u>Square Feet:</u> '+square_feet+'</h3>\n'+
                        '<h3><u># Bedrooms:</u> '+beds+'</h3>\n'+
                        '<h3><u># Bathrooms:</u> '+baths+'</h3>\n'+
                        '<h3><u>Year Built:</u> '+year_built+'</h3>\n'+
                        '<h3><u>Owner:</u> '+features['PRMY_OWNER']+'</h3>\n'+
                        '<h3><a  style="color:blue; text-decoration: underline" href="' + street_view_url + '" target="_blank">' + "See Google Street View" + '</a></h3>'
                        )
                .addTo(map);
    return popup;
};



// Shapefile properties:
// ---------------------
// ACRES: 0.7
// ADD_ADDR: "2 Schickel Rd"
// ADD_CITY: "Ithaca"
// ADD_OWNER: "Hongwei Guan"
// ADD_POBOX: ""
// ADD_STATE: "NY"
// ADD_ZIP: "14850"
// AGDISTCODE: ""
// AGDISTNAME: ""
// BLDG_DESC: "Ranch"
// BLDG_STYLE: "01"
// BOOK: 56627
// CALC_ACRES: 0.640365402622
// COUNTY: "Tompkins"
// CT_NAME: "Ithaca"
// CT_SWIS: "503000"
// DEPTH: 0
// DUP_GEO: ""
// FRONT: 0
// FUEL_DESC: "Gas"
// FUEL_TYPE: "2"
// FULL_MV: 200000
// GRID_EAST: 842699
// GRID_NORTH: 874638
// HEAT_DESC: "Hot wtr/stm"
// HEAT_TYPE: "3"
// LAND_AV: 25800
// LOC_STREET: "Schickel Rd"
// LOC_ST_NBR: "2"
// LOC_UNIT: ""
// LOC_ZIP: ""
// MAIL_ADDR: "2 Schickel Rd"
// MAIL_CITY: "Ithaca"
// MAIL_STATE: "NY"
// MAIL_ZIP: "14850"
// MUNI_NAME: "Ithaca, Town"
// MUNI_PCLID: "50300021992"
// NAMESOURCE: ""
// NBR_BEDRM: 3
// NBR_F_BATH: 2
// NBR_KITCHN: 1
// NYS_NAME: ""
// OWNER_TYPE: "8"
// PAGE: 4001
// PARCELADDR: "2 Schickel Rd"
// PO_BOX: ""
// PRINT_KEY: "36.-2-15"
// PRMY_OWNER: "Hao, Yue"
// PROP_CLASS: "210"
// ROLL_SECT: ""
// ROLL_YR: 2017
// SBL: "03600000020150000000"
// SCH_CODE: "500700"
// SCH_NAME: "Ithaca"
// SEWER_DESC: "Private"
// SEWER_TYPE: "2"
// SPATIAL_YR: 2017
// SQFT_LIV: 1832
// SQ_FT: 0
// SWIS: "503089"
// SWISPKID: "50308936.-2-15"
// SWISSBLID: "50308903600000020150000000"
// TOTAL_AV: 200000
// USEDASCODE: ""
// USEDASDESC: ""
// UTILITIES: "4"
// UTIL_DESC: "Gas & elec"
// WATER_DESC: "Comm/public"
// WATER_SUPP: "3"
// YR_BLT: 1993




// School Zone Properties:
// properties:
// ALAND: 173961150
// AWATER: 26333549
// FUNCSTAT: "E"
// GEOID: "3626940"
// HIGRADE: "12"
// INTPTLAT: "+42.8910396"
// INTPTLON: "-076.4138846"
// LOGRADE: "KG"
// LSAD: "00"
// MTFCC: "G5420"
// NAME: "Skaneateles Central School District"
// SDTYP: ""
// STATEFP: "36"
// UNSDLEA: "26940"












//
