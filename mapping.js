
function setUpGlobalVars() {

    // Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjZmFzdCIsImEiOiJjanVlbGRxbTUwNGVlNDlwcXRxNnFhYnlzIn0.-dc9uxSNW4TUYbC96E8zjA';

    // Initliaze base map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/secfast/cjupvuh6m155a1gqwh1d4ko6u',
      center: [-76.5, 42.65],
      zoom: 8,
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
                      };

    // Load map
    map.on('load', function () {

        // Add satellite layer
        map.addLayer({
          id: 'satellite',
          source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
          type: "raster",
          layout: {
            'visibility': 'none'
          }
        },'admin-state-province');

        // map.addSource('school_zones',{
        //     type: 'vector',
        //     url: 'mapbox://secfast.5vs7dj3t'
        // });

        // map.addLayer({
        //   "id": 'school_zones',
        //   "type": "fill",
        //   "source": 'school_zones',
        //   "source-layer": 'school_zones-4v2mmg',
        //   "paint": {
        //     'fill-opacity': 0,
        //     'fill-outline-color': '#000000',
        //     'fill-color': '#000000',
        //   }
        // },'admin-state-province');

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
        // Display property features when fill layer parcels are clicked
        map.on('click', function (e) {
            var lngLat = e.lngLat;
            let f = map.queryRenderedFeatures(e.point);
            if (f.length && (typeof checkMapLayer !== 'undefined')) {
                for (i=0; i<f.length; i++) {
                    if (f[i].layer.id.includes('fills') || f[i].layer.id.includes('_fill_outlines')) {
                        if (map.getLayoutProperty(activeLayer+'_fills','visibility') == 'visible' || map.getLayoutProperty(activeLayer+'_fill_outlines','visibility') == 'visible') {
                            popup.remove();
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
                if (f.length) {
                    for (i=0; i<f.length; i++) {
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
                                .setHTML("<p style='font-size:140%;'>"+address+"</p><p style='font-size:120%;'>"+"<u>Assessed Value*:</u> $"+assessed_value+"</p><p style='font-size:100%;'>"+"<u>Parcel ID:</u> "+parcel_id+"</p><p style='font-size:90%;'>* May not reflect market value</p>")
                                .addTo(map);

                            hoveredStateId = f[i].id;
                            map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, {hover: true});
                            break;
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
                };
            };
        });
    });


    // Toggle satellite mode when clicked
    var toggleableLayerIds = ['Satellite Mode'];
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = function (e) {
            var checkMapLayer = map.getLayer('3d-buildings');
            if (typeof checkMapLayer !== 'undefined') {
                if (this.textContent == 'Satellite Mode') {
                    satellite_view = !satellite_view;
                    var clickedLayer = 'satellite';
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
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    if (layer_id != 'none') {
                        map.setLayoutProperty(layer_id+'_fill_outlines', 'visibility', 'none');
                        // map.setLayoutProperty(layer_id+'_outlines', 'visibility', 'none');
                        map.setLayoutProperty(layer_id+'_fills', 'visibility', 'visible')
                        map.setPaintProperty(layer_id+'_outlines', 'line-color', 'black');
                    };
                    this.className = '';
                } else {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    if (layer_id != 'none') {
                        map.setLayoutProperty(layer_id+'_fill_outlines', 'visibility', 'visible');
                        map.setLayoutProperty(layer_id+'_outlines', 'visibility', 'visible');
                        map.setLayoutProperty(layer_id+'_fills', 'visibility', 'none')
                        map.setPaintProperty(layer_id+'_outlines', 'line-color', 'orange');
                    };
                    this.className = 'active';
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
                            map.setPaintProperty(key+'_outlines', 'line-color', 'orange');
                            // map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                        } else {
                            map.flyTo({
                                center: county_dict[key][2],
                                zoom: 12,
                                pitch: 10,
                                bearing: 0,
                            });
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'visible');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'visible');
                        };
                    } else {
                        if (map.getLayoutProperty(key+'_fills', 'visibility') == 'visible') {
                            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
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
                        '<h3><a href="' + street_view_url + '" target="_blank">' + "See Google Street View" + '</a></h3>'
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
