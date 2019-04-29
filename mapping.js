
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
    var census1hoveredStateId =  null;
    var census2hoveredStateId =  null;
    var activeLayer = 'none';

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

      var toggle_layers = {
                          // 'terrain': ['mapbox://mapbox.mapbox-terrain-v2','contour','Terrain','vector'],
                          'school_zones': ['mapbox://secfast.5vs7dj3t','school_zones-4v2mmg','School Zones','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'census_1': ['mapbox://secfast.0fjc50cg','census_2-6uqqfb','Basic Census Data','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'census_2': ['mapbox://secfast.3r9erj99','census-3p47uv','Advanced Census Data','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'congress': ['mapbox://secfast.ax0xh5qg','congress-962d2l','Congressional Districts','vector',["match",['get','Party'],'Republican', 'red','Democrat', 'blue','grey'],0],
                          'senate': ['mapbox://secfast.59ncsd8l','senate-0213ch','State Senate','vector',["match",['get','party'],'Republican','red','Democrat','blue','grey'],0],
                          'assembly': ['mapbox://secfast.5vwxb8ws','assembly-5wkkao','State Assembly','vector',["match",['get','party'],'Republican', 'red','Democrat', 'blue','grey'],0],
                          'counties': ['mapbox://secfast.0rhcbdxi','counties-7t5hf6','Counties','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'city_town': ['mapbox://secfast.d1k5plil','cities_towns-2uok5b','Cities','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'villages': ['mapbox://secfast.52th248l','villages-bnrwmd','Villages','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'indian_territory': ['mapbox://secfast.bc21xqhx','indian_territory-4n30ds','Indian Territory','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'crops': ['mapbox://secfast.63qhbo2t','CDL_2010_NY-7ym7gh','Crop Cover','raster'],
                          'agriculture': ['mapbox://secfast.2euzzuud','agriculture-913eim','Agricultural Districts','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'soil': ['mapbox://secfast.1h9viy25','soil-0j12c4','Soil Info','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'precip': ['mapbox://secfast.4gi9cwh5','precip-0qg8b2','Precipitation','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'geology': ['mapbox://secfast.4cc0940p','geology-7dpveh','Geology','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'zebra': ['mapbox://secfast.9qepxeqa','zebra_mussels-3pzz5l','Zebra Mussels','vector'],
                          'birds': ['mapbox://secfast.7o9su5kf','birds-0ixrxg','Bird Migration','vector'],
                          'empire_zones': ['mapbox://secfast.bhdyfqno','empirezone-ah3phb','Empire Zone Program','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
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

        // Add sources for layers
        for (var key in toggle_layers) {
            map.addSource(key,{
              type: toggle_layers[key][3],
              url: toggle_layers[key][0]
            });
            if (key == 'zebra') {
                map.addLayer({
                  "id": 'zebra',
                  "type": "symbol",
                  "source": 'zebra',
                  "source-layer": 'zebra_mussels-3pzz5l',
                  "layout": {
                    "icon-image": "marker-11",
                  },
                },'admin-state-province');
            } else if (key == 'crops') {
                map.addLayer({
                  "id": 'crops',
                  "type": "raster",
                  "source": 'crops',
                  "source-layer": 'CDL_2010_NY-7ym7gh',
                },'admin-state-province');
            } else if (key == 'birds') {
                map.addLayer({
                  "id": 'birds',
                  "type": "line",
                  "source": 'birds',
                  "source-layer": 'birds-0ixrxg',
                  "paint": {
                    'line-width': 2,
                  }
                },'admin-state-province');
            } else {
                map.addLayer({
                  "id": key,
                  "type": "line",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    'line-width': 2,
                  }
                },'admin-state-province');
                map.addLayer({
                  "id": key+'_fill',
                  "type": "fill",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    'fill-opacity': toggle_layers[key][5],
                    'fill-color':toggle_layers[key][4]
                  }
                },'admin-state-province');
                if (key != 'soil' && key != 'senate' && key != 'congress' && key != 'assembly' && key != 'county' && key != 'school' && key != 'city_town' && key != 'village' && key != 'indian_territory') {
                    map.setLayoutProperty(key+'_fill','visibility','none');
                };
            };
            map.setLayoutProperty(key,'visibility','none')
        };


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
            console.log(f);
            if (f.length && (typeof checkMapLayer !== 'undefined')) {
                census_clicked = false;
                for (i=0; i<f.length; i++) {
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
                        if (f[i].layer.id == 'city_town_fill') {
                            county = true;
                            var county_name = f[i].properties.COUNTY;
                            var city_name = f[i].properties.NAME;
                        };
                        if (f[i].layer.id == 'villages_fill') {
                            village = true;
                            var village_name = f[i].properties.NAME;
                        };
                        if (f[i].layer.id == 'school_zones_fill') {
                            school = true;
                            var school_name = f[i].properties.NAME;
                        };
                        if (f[i].layer.id == 'indian_territory_fill') {
                            indian = true;
                            var indian_name = f[i].properties.NAME;
                        };
                        if (f[i].layer.id == 'senate_fill') {
                            senate = true;
                            ending = findSuffix(f[i].properties.DISTRICT.toString())
                            var senate_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.party[0]+'.)';
                        };
                        if (f[i].layer.id == 'congress_fill') {
                            congress = true;
                            var string = f[i].properties.DISTRICT.toString()
                            ending = findSuffix(f[i].properties.DISTRICT.toString())
                            var congress_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.Party[0]+'.)';
                        };
                        if (f[i].layer.id == 'assembly_fill') {
                            assembly = true;
                            ending = findSuffix(f[i].properties.DISTRICT.toString())
                            var assembly_name = f[i].properties.DISTRICT + ending + ' District - '+f[i].properties.NAME+' ('+f[i].properties.party[0]+'.)';
                        };


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

                            hoveredStateId = f[i].id;
                            map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, {hover: true});
                        };

                        if (f[i].layer.id.includes('census_1_fill') || f[i].layer.id.includes('census_2_fill')) {
                            on_census = !on_census;
                            map.getCanvas().style.cursor = 'pointer';
                            if (census1hoveredStateId) {
                                map.setFeatureState({source: 'census_1', id: census1hoveredStateId, sourceLayer: toggle_layers['census_1'][1]}, {hover: false});
                                census1hoveredStateId = f[i].id;
                                map.setFeatureState({source: 'census_1', id: census1hoveredStateId, sourceLayer: toggle_layers['census_1'][1]}, {hover: true});
                            };
                            if (census2hoveredStateId) {
                                map.setFeatureState({source: 'census_2', id: census2hoveredStateId, sourceLayer: toggle_layers['census_2'][1]}, {hover: false});
                                census2hoveredStateId = f[i].id;
                                map.setFeatureState({source: 'census_2', id: census2hoveredStateId, sourceLayer: toggle_layers['census_2'][1]}, {hover: true});
                            };

                            tot_pop = f[i].properties.POP2000;
                            var data1 = google.visualization.arrayToDataTable([
                              ['Race', 'Population'],
                              ['White',     +((f[i].properties.WHITE/tot_pop).toFixed(2))],
                              ['Black',      +((f[i].properties.BLACK/tot_pop).toFixed(2))],
                              ['Hispanic',  +((f[i].properties.HISPANIC/tot_pop).toFixed(2))],
                              ['Asian', +((f[i].properties.ASIAN/tot_pop).toFixed(2))],
                              ['Native American', +((f[i].properties.AMERI_ES/tot_pop).toFixed(2))],
                              ['Pacific Islander', +((f[i].properties.HAWN_PI/tot_pop).toFixed(2))],
                              ['Multi Race', +((f[i].properties.MULT_RACE/tot_pop).toFixed(2))],
                              ['Other', +((f[i].properties.OTHER/tot_pop).toFixed(2))],
                            ]);
                            var data2 = google.visualization.arrayToDataTable([
                              ['Age', 'Population'],
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
                            div.innerHTML = '<div id="chart_holder" align="center" style="width: 300px; height: 20px;"></div>'
                            div1 = document.createElement('div');
                            div2 = document.createElement('div');
                            div1.innerHTML = '<div id="donutchart1" style="position:relative; width: 250px; height: 150px;"></div>'
                            div2.innerHTML = '<div id="donutchart2" style="position:relative; width: 250px; height: 150px;"></div>'
                            div.appendChild(div1);
                            div.appendChild(div2);
                            var chart1 = new google.visualization.PieChart(div1);
                            var chart2 = new google.visualization.BarChart(div2);
                            popup.setLngLat(e.lngLat)
                                .setDOMContent(div)
                                .addTo(map);

                            chart1.draw(data1, options1);
                            chart2.draw(data2, options2);
                            // open_popup = true;
                        };

                        if (f[i].layer.id.includes('census_1_fill')) {
                            if (census1hoveredStateId) {
                                map.setFeatureState({source: 'census_1', id: census1hoveredStateId, sourceLayer: toggle_layers['census_1'][1]}, {hover: false});
                            };
                            census1hoveredStateId = f[i].id;
                            map.setFeatureState({source: 'census_1', id: census1hoveredStateId, sourceLayer: toggle_layers['census_1'][1]}, {hover: true});
                        };
                        if (f[i].layer.id.includes('census_2_fill')) {
                            if (census2hoveredStateId) {
                                map.setFeatureState({source: 'census_2', id: census2hoveredStateId, sourceLayer: toggle_layers['census_2'][1]}, {hover: false});
                            };
                            census2hoveredStateId = f[i].id;
                            map.setFeatureState({source: 'census_2', id: census2hoveredStateId, sourceLayer: toggle_layers['census_2'][1]}, {hover: true});
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
                        if (map.getLayoutProperty('census_1_fill','visibility') == 'visible') {
                            if (census1hoveredStateId) {
                                map.setFeatureState({source: 'census_1', id: census1hoveredStateId, sourceLayer: toggle_layers['census_1'][1]}, {hover: false});
                            };
                            map.getCanvas().style.cursor = '';
                            census1hoveredStateId =  null;
                        };
                        if (map.getLayoutProperty('census_2_fill','visibility') == 'visible') {
                            if (census2hoveredStateId) {
                                map.setFeatureState({source: 'census_2', id: census2hoveredStateId, sourceLayer: toggle_layers['census_2'][1]}, {hover: false});
                            };
                            map.getCanvas().style.cursor = '';
                            census2hoveredStateId =  null;
                        };
                    };
                };
                element = document.getElementById('county');
                element2 = document.getElementById('city');
                if (county) {
                    element.innerHTML = county_name;
                    element2.innerHTML = city_name;
                } else {
                    element.innerHTML = '-';
                    element2.innerHTML = '-';
                }
                element = document.getElementById('village');
                if (village) {
                    element.innerHTML = village_name;
                } else {
                    element.innerHTML = '-';
                }
                element = document.getElementById('school');
                if (school) {
                    element.innerHTML = school_name;
                } else {
                    element.innerHTML = '-';
                }
                element = document.getElementById('indian');
                if (indian) {
                    element.innerHTML = indian_name;
                } else {
                    element.innerHTML = '-';
                }
                element = document.getElementById('senate');
                if (senate) {
                    element.innerHTML = senate_name;
                } else {
                    element.innerHTML = '-';
                }
                element = document.getElementById('congress');
                if (congress) {
                    element.innerHTML = congress_name;
                } else {
                    element.innerHTML = '-';
                }
                element = document.getElementById('assembly');
                if (assembly) {
                    element.innerHTML = assembly_name;
                } else {
                    element.innerHTML = '-';
                }
            };
        });
    });


    // Toggle satellite mode when clicked
    var toggleableLayerIds = ['Satellite View','Crop Cover','Counties','Cities','Villages','Indian Territory','School Zones','Basic Census Data','Advanced Census Data','Congressional Districts','State Senate','State Assembly','Empire Zone Program','Agricultural Districts','Soil Info','Precipitation','Geology','Bird Migration','Zebra Mussels'];
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;
        var clickedLayer = this.textContent;
        link.onclick = function (e) {
            var checkMapLayer = map.getLayer('3d-buildings');
            if (typeof checkMapLayer !== 'undefined') {
                if (this.textContent == 'Satellite View') {
                    clickedLayer = 'satellite';
                    if (activeLayer != 'none') {
                        if (map.getLayoutProperty(activeLayer+'_fills', 'visibility') == 'visible') {
                          map.setLayoutProperty(activeLayer+'_fills', 'visibility', 'none');
                          map.setLayoutProperty(activeLayer+'_fill_outlines', 'visibility', 'visible');
                          map.setPaintProperty(activeLayer+'_outlines','line-color','orange');
                        } else {
                          map.setLayoutProperty(activeLayer+'_fills', 'visibility', 'visible');
                          map.setLayoutProperty(activeLayer+'_fill_outlines', 'visibility', 'none');
                          map.setPaintProperty(activeLayer+'_outlines','line-color','black');
                        };
                    }
                    if (map.getLayoutProperty('satellite','visibility') == 'visible') {
                        map.setLayoutProperty('satellite','visibility','none');
                        this.className = 'active';
                        var color = 'black';
                    } else {
                        map.setLayoutProperty('satellite','visibility','visible');
                        this.className = 'inactive';
                        var color = 'orange';
                    };
                    for (var key in toggle_layers) {
                        if (key == 'crops' || key == 'zebra') continue;
                        map.setPaintProperty(key,'line-color',color)
                    };
                } else {
                    for (key in toggle_layers) {
                        if (toggle_layers[key][2] == this.textContent) {
                          clickedLayer = key;
                          if (map.getLayoutProperty(clickedLayer, 'visibility') == 'visible') {
                            if (clickedLayer == 'census_1') {
                              map.setLayoutProperty('census_1_fill', 'visibility', 'none');
                            };
                            if (clickedLayer == 'census_2') {
                              map.setLayoutProperty('census_2_fill', 'visibility', 'none');
                            };
                            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                            this.className = 'active';
                          } else {
                            if (clickedLayer == 'census_1') {
                              map.setLayoutProperty('census_1_fill', 'visibility', 'visible');
                            };
                            if (clickedLayer == 'census_2') {
                              map.setLayoutProperty('census_2_fill', 'visibility', 'visible');
                            };
                            if (clickedLayer == 'agriculture') {
                              map.flyTo({
                                center: [-75.9, 42.9],
                                zoom: 8.5,
                                pitch: 10,
                                bearing: 0,
                              });
                            };
                            if (clickedLayer == 'census_2') {
                              map.flyTo({
                                center: [-76, 43],
                                zoom: 10.5,
                                pitch: 10,
                                bearing: 0,
                              });
                            };
                            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                            this.className = 'inactive';
                            break;
                          };
                      };
                };
                if (clickedLayer == 'senate') {
                    if (map.getPaintProperty('senate_fill', 'fill-opacity') != .25) {
                      map.setPaintProperty('senate_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('senate_fill', 'fill-opacity', 0)
                    };
                } else if (clickedLayer == 'congress') {
                    if (map.getPaintProperty('congress_fill', 'fill-opacity') != .25) {
                        map.setPaintProperty('congress_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('congress_fill', 'fill-opacity', 0)
                    };
                } else if (clickedLayer == 'assembly') {
                    if (map.getPaintProperty('assembly_fill', 'fill-opacity') != .25) {
                      map.setPaintProperty('assembly_fill', 'fill-opacity', .25)
                    } else {
                      map.setPaintProperty('assembly_fill', 'fill-opacity', 0)
                    };
                };
                e.preventDefault();
                e.stopPropagation();
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
                    if (map.getLayoutProperty('satellite','visibility') == 'visible') {
                        map.setPaintProperty(key+'_outlines','line-color','orange');
                        if (map.getLayoutProperty(key+'_fill_outlines', 'visibility') == 'visible') {
                            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'none');
                        } else {
                            map.flyTo({
                                center: county_dict[key][2],
                                zoom: 12,
                                pitch: 10,
                                bearing: 0,
                            });
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'visible');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'visible');
                        };
                    } else {
                        map.setPaintProperty(key+'_outlines','line-color','black');
                        if (map.getLayoutProperty(key+'_fills', 'visibility') == 'visible') {
                            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                            map.setLayoutProperty(key+'_fill_outlines', 'visibility', 'none');
                            map.setLayoutProperty(key+'_outlines', 'visibility', 'none');
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

// Function to find correct suffix for numbers (e.g. 'th' or 'st')
function findSuffix(string) {
    string.charAt(string.length - 1)
    if (string.charAt(string.length - 1) == '2') {
      if (string.charAt(string.length - 2) == '1') {
          var ending = 'th';
      } else {
          var ending = 'nd';
      };
    } else if (string.charAt(string.length - 1) == '3') {
      if (string.charAt(string.length - 2) == '1') {
          var ending = 'th';
      } else {
          var ending = 'rd';
      };
    } else if (string.charAt(string.length - 1) == '1') {
      if (string.charAt(string.length - 2) == '1') {
          var ending = 'th';
      } else {
          var ending = 'st';
      };
    } else {
      var ending = 'th';
    };

    return ending;
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






//
