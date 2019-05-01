
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
    var geologyhoveredStateId =  null;
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
                          'precip': ['mapbox://secfast.4gi9cwh5','precip-0qg8b2','Annual Precipitation (in.)','vector',['interpolate', ['linear'],['get','RANGE'],30, '#B5E3E9',65, '#3146DB',],.7,],
                          'geology': ['mapbox://secfast.4cc0940p','geology-7dpveh','Geology','vector',["case",
                            ['==',['get','ROCKDESC'],'Lower Ordovician (Canadian)'],rainbow(31,1),
                            ['==',['get','ROCKDESC'],'Middle Ordovician (Mohawkian)'],rainbow(31,2),
                            ['==',['get','ROCKDESC'],'Cambrian'],rainbow(31,3),
                            ['==',['get','ROCKDESC'],'Orthogneiss'],rainbow(31,4),
                            ['==',['get','ROCKDESC'],'Syenite'],rainbow(31,5),
                            ['==',['get','ROCKDESC'],'Y sedimentary rocks'],rainbow(31,6),
                            ['==',['get','ROCKDESC'],'Younger Y granitic rocks'],rainbow(31,7),
                            ['==',['get','ROCKDESC'],'Paragneiss and schist'],rainbow(31,8),
                            ['==',['get','ROCKDESC'],'Anorthosite'],rainbow(31,9),
                            ['==',['get','ROCKDESC'],'Upper Ordovician (Cincinnatian)'],rainbow(31,10),
                            ['==',['get','ROCKDESC'],'Cambrian eugeosynclinal'],rainbow(31,11),
                            ['==',['get','ROCKDESC'],'Ordovician eugeosynclinal'],rainbow(31,12),
                            ['==',['get','ROCKDESC'],'Lower Silurian (Alexandrian)'],rainbow(31,13),
                            ['==',['get','ROCKDESC'],'Middle Silurian (Niagaran)'],rainbow(31,14),
                            ['==',['get','ROCKDESC'],'Upper Silurian (Cayugan)'],rainbow(31,15),
                            ['==',['get','ROCKDESC'],'Lower Devonian'],rainbow(31,16),
                            ['==',['get','ROCKDESC'],'Middle Devonian'],rainbow(31,17),
                            ['==',['get','ROCKDESC'],'Lower Ordovician and Cambrian carbonate rocks'],rainbow(31,18),
                            ['==',['get','ROCKDESC'],'Upper Devonian'],rainbow(31,19),
                            ['==',['get','ROCKDESC'],'Upper Devonian continental'],rainbow(31,20),
                            ['==',['get','ROCKDESC'],'Middle Devonian continental'],rainbow(31,21),
                            ['==',['get','ROCKDESC'],'Silurian'],rainbow(31,22),
                            ['==',['get','ROCKDESC'],'Mississippian'],rainbow(31,23),
                            ['==',['get','ROCKDESC'],'Devonian'],rainbow(31,24),
                            ['==',['get','ROCKDESC'],'Pleistocene'],rainbow(31,25),
                            ['==',['get','ROCKDESC'],'Paleozoic mafic intrusives'],rainbow(31,26),
                            ['==',['get','ROCKDESC'],'Triassic'],rainbow(31,27),
                            ['==',['get','ROCKDESC'],'Triassic mafic intrusives'],rainbow(31,28),
                            ['==',['get','ROCKDESC'],'Lower Paleozoic granitic rocks'],rainbow(31,29),
                            ['==',['get','ROCKDESC'],'Upper Cretaceous'],rainbow(31,30),
                            ['==',['get','ROCKDESC'],'Ultramafic rocks'],rainbow(31,31),
                            '#000000'
                          ],["case",["boolean", ["feature-state","hover"], false], 1,.5]],
                          'zebra': ['mapbox://secfast.9qepxeqa','zebra_mussels-3pzz5l','Zebra Mussels','vector'],
                          'birds': ['mapbox://secfast.7o9su5kf','birds-0ixrxg','Bird Migration','vector'],
                          'empire_zones': ['mapbox://secfast.bhdyfqno','empirezone-ah3phb','Empire Zone Program','vector','#FFB533',["case",["boolean", ["feature-state","hover"], false], .7,0],],
                          'rails': ['mapbox://secfast.102qlnny','rails_2-dsd9c5','Railroads','vector'],
                          'biodiversity': ['mapbox://secfast.2lstx3qf','Biodiversity_Indicator-46nyrk','Biodiversity Indicator','raster'],
                          'water_biodiversity': ['mapbox://secfast.5f341fim','Watershed-Biodiversity-12g1bi','Watershed Biodiversity','vector','#79CC79',.7],
                          'traffic': ['mapbox://secfast.4khlw6gc','AADT_2015_tdv-5aggpk','Average Annual Traffic','vector'],
                          'watershed': ['mapbox://secfast.86eo47nf','aa_aas_watersheds_2-cnc9go','AA and AAs Watersheds','vector','#79CC79',.7],
                          'dec_land': ['mapbox://secfast.7ivjw684','DEC_lands-7ljzj9','DEC Land','vector','#79CC79',.7],
                          'lwrp': ['mapbox://secfast.7iomvt5s','LWRP_Communities-5p8xpg','Local Waterfront Revitatilzation Program','vector','#79CC79',.7],
                          'wells': ['mapbox://secfast.460kvfe7','WaterWellProgram-84yp5j','Water Wells','vector'],
                          'crit_env': ['mapbox://secfast.4xzc0n3a','Critical_Env_Areas-b4nsa9','Critical Environmental Areas','vector','#79CC79',.7],
                          'aquifers': ['mapbox://secfast.0c1xjicm','primaryaquifers-4ftr6o','Aquifers','vector','#79CC79',.7],
                          'eco_zone': ['mapbox://secfast.045p6lht','ecozone-68q54s','EcoZone','vector','#79CC79',.7],
                          'hunt_zone': ['mapbox://secfast.6wjgtb4v','hunt_zone-6xv8r5','North/South Hunting Line','vector'],
                          'dams': ['mapbox://secfast.9ybj04wk','nysdec_dams-72j3u4','Dams','vector'],
                          'phosphorus': ['mapbox://secfast.a1uuppsr','phosphorus_zones-aehz2m','Enhanced Phosphorus Watersheds','vector','#79CC79',.7],
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

            if (key == 'zebra' || key == 'dams' || key == 'wells') {
                map.addLayer({
                  "id": key,
                  "type": "symbol",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "layout": {
                    "icon-image": "marker-11",
                  },
                },'admin-state-province');
            } else if (key == 'crops' || key == 'biodiversity') {
                map.addLayer({
                  "id": key,
                  "type": "raster",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    "raster-saturation": 1,
                  },
                },'admin-state-province');
            } else if (key == 'birds' || key == 'rails' || key == 'hunt_zone') {
                map.addLayer({
                  "id": key,
                  "type": "line",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    'line-width': 2,
                  }
                },'admin-state-province');
            } else if (key == 'traffic') {
                map.addLayer({
                  "id": key,
                  "type": "line",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    'line-width': [
                      "case",
                      ['<',['get','AADT'],1500],2,
                      ['<',['get','AADT'],4000],2,
                      ['<',['get','AADT'],10000],2,
                      ['<',['get','AADT'],25000],3,
                      ['<',['get','AADT'],75000],4,
                      ['<',['get','AADT'],300000],5,
                      ['>=',['get','AADT'],300000],6,
                      2
                    ],
                    'line-color': [
                      "case",
                      ['<',['get','AADT'],1500],'#6EA34A',
                      ['<',['get','AADT'],4000],'#64DB47',
                      ['<',['get','AADT'],10000],'#B4DB33',
                      ['<',['get','AADT'],25000],'#EEC137',
                      ['<',['get','AADT'],75000],'#EE9837',
                      ['<',['get','AADT'],300000],'#EE6637',
                      ['>=',['get','AADT'],300000],'#F13A27',
                      '#AFB4AC'
                    ]
                  }
                },'admin-state-province');
            } else if (key == 'eco_zone') {
                map.addLayer({
                  "id": key,
                  "type": "fill",
                  "source": key,
                  "source-layer": toggle_layers[key][1],
                  "paint": {
                    'fill-opacity': .4,
                    'fill-color': [
                      "match",
                      ["get","MINOR_DESC"],
                      'BLACK RIVER VALLEY',rainbow(40,1),
                      'EASTERN ONTARIO PLAIN',rainbow(40,2),
                      'TUG HILL TRANSITION',rainbow(40,3),
                      'CENTRAL TUG HILL',rainbow(40,4),
                      'CHAMPLAIN VALLEY',rainbow(40,5),
                      'TACONIC FOOTHILLS',rainbow(40,6),
                      'OSWEGO LOWLANDS',rainbow(40,7),
                      'DRUMLIN',rainbow(40,8),
                      'EASTERN ADIRONDACK TRANSITION',rainbow(40,9),
                      'CENTRAL HUDSON',rainbow(40,10),
                      'NEVERSINK HIGHLANDS',rainbow(40,11),
                      'SHAWANKGUNK HILLS',rainbow(40,12),
                      'CHAMPLAIN TRANSITION',rainbow(40,13),
                      'ST. LAWRENCE PLAINS',rainbow(40,14),
                      'MALONE PLAINS',rainbow(40,15),
                      'ST.LAWRENCE TRANSITION',rainbow(40,16),
                      'WESTERN ADIRONDACK TRANSITION',rainbow(40,17),
                      'WESTERN ADIRONDACK FOOTHILLS',rainbow(40,18),
                      'SABLE HIGHLANDS',rainbow(40,19),
                      'INDIAN RIVER LAKES',rainbow(40,20),
                      'EASTERN ADIRONDACK FOOTHILLS',rainbow(40,21),
                      'ADIRONDACK HIGH PEAKS',rainbow(40,22),
                      'CENTRAL ADIRONDACKS',rainbow(40,23),
                      'ERIE-ONTARIO PLAIN',rainbow(40,24),
                      'MOHAWK VALLEY',rainbow(40,25),
                      'TACONIC MOUNTAINS',rainbow(40,26),
                      'CENTRAL APPALACHIANS',rainbow(40,27),
                      'CATTARAUGUS HIGHLANDS',rainbow(40,28),
                      'FINGER LAKE HIGHLANDS',rainbow(40,29),
                      'RENSSELAER HILLS',rainbow(40,30),
                      'HELDERBERG HIGHLANDS',rainbow(40,31),
                      'SCHOHARIE HILLS',rainbow(40,32),
                      'ALLEGHENY HILLS',rainbow(40,33),
                      'CATSKILL PEAKS',rainbow(40,34),
                      'DELAWARE HILLS',rainbow(40,35),
                      'COASTAL LOWLANDS',rainbow(40,36),
                      'MANHATTAN HILLS',rainbow(40,37),
                      'MONGAUP HILLS',rainbow(40,38),
                      'HUDSON HIGHLANDS',rainbow(40,39),
                      'TRIASSIC LOWLANDS',rainbow(40,40),
                      '#000000'
                  ]
                  }
                },'admin-state-province');
                map.setLayoutProperty('eco_zone','visibility','none')
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
                if (key == 'precip') {
                    map.addLayer({
                      "id": 'precip_text',
                      "type": "symbol",
                      "source": 'precip',
                      "source-layer": 'precip-0qg8b2',
                      "layout": {
                        "text-field":[
                                  "case",
                                  ["==",["get","RANGE"],0],
                                  "",
                                  ["get","RANGE"],
                                  ]
                      },
                    },'admin-state-province');
                    map.setLayoutProperty('precip_text','visibility','none')
                };
                if (key != 'soil' && key != 'senate' && key != 'congress' && key != 'assembly' && key != 'county' && key != 'school_zones' && key != 'city_town' && key != 'villages' && key != 'indian_territory') {
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
            console.log(f)
            if (f.length && (typeof checkMapLayer !== 'undefined')) {
                for (i=0; i<f.length; i++) {
                    if (f[i].layer.id.includes('fills') || f[i].layer.id.includes('_fill_outlines')) {
                        if (map.getLayoutProperty(activeLayer+'_fills','visibility') == 'visible' || map.getLayoutProperty(activeLayer+'_fill_outlines','visibility') == 'visible') {
                            if (hoveredStateId) {
                                map.setFeatureState({source: activeLayer, id: hoveredStateId, sourceLayer: county_dict[activeLayer][1]}, {hover: false});
                            };
                            map.getCanvas().style.cursor = '';
                            hoveredStateId =  null;
                        };
                        new_popup = makePopUp(map,f[i],lngLat);
                        open_popup = true;
                    };
                    if (f[i].layer.id.includes('geology') && map.getLayoutProperty('geology_fill','visibility') == 'visible') {
                        g_popup = geologyPopUp(map,f[i],lngLat);
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
                var on_geology = false;
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

                        if (f[i].layer.id.includes('geology')) {
                          on_geology = !on_geology;
                          map.getCanvas().style.cursor = 'pointer';
                          if (geologyhoveredStateId) {
                            map.setFeatureState({source: 'geology', id: geologyhoveredStateId, sourceLayer: toggle_layers['geology'][1]}, {hover: false});
                            geologyhoveredStateId = f[i].id;
                            map.setFeatureState({source: 'geology', id: geologyhoveredStateId, sourceLayer: toggle_layers['geology'][1]}, {hover: true});
                          }
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
                        if (f[i].layer.id.includes('geology')) {
                            if (geologyhoveredStateId) {
                                map.setFeatureState({source: 'geology', id: geologyhoveredStateId, sourceLayer: toggle_layers['geology'][1]}, {hover: false});
                            };
                            geologyhoveredStateId = f[i].id;
                            map.setFeatureState({source: 'geology', id: geologyhoveredStateId, sourceLayer: toggle_layers['geology'][1]}, {hover: true});
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
                    if (!on_geology) {
                      if (geologyhoveredStateId) {
                        map.setFeatureState({source: 'geology', id: geologyhoveredStateId, sourceLayer: toggle_layers['geology'][1]}, {hover: false});
                      };
                      map.getCanvas().style.cursor = '';
                      geologyhoveredStateId =  null;
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
                };
            };
        });
    });


    // Toggle satellite mode when clicked
    // Toggle satellite mode when clicked
    var toggleableLayerIds = ['Satellite View',
                              'Crop Cover',
                              'Biodiversity Indicator',
                              'Counties',
                              'Cities',
                              'Villages',
                              'Indian Territory',
                              'School Zones',
                              'Basic Census Data',
                              'Advanced Census Data',
                              'Congressional Districts',
                              'State Senate',
                              'State Assembly',
                              'Empire Zone Program',
                              'National Parks',
                              'State Parks',
                              'Agricultural Districts',
                              'Soil Info',
                              'Annual Precipitation (in.)',
                              'Geology',
                              'Bird Migration',
                              'Zebra Mussels',
                              'Railroads',
                              'Average Annual Traffic',
                              'Enhanced Phosphorus Watersheds',
                              'Watershed Biodiversity',
                              'Average Annual Traffic',
                              'AA and AAs Watersheds',
                              'DEC Land',
                              'Local Waterfront Revitatilzation Program',
                              'Water Wells',
                              'Critical Environmental Areas',
                              'Aquifers',
                              'EcoZone',
                              'North/South Hunting Line',
                              'Dams'];

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
                        } else if  (map.getLayoutProperty(activeLayer+'_fill_outlines', 'visibility') == 'visible') {
                          map.setLayoutProperty(activeLayer+'_fills', 'visibility', 'visible');
                          map.setLayoutProperty(activeLayer+'_fill_outlines', 'visibility', 'none');
                          map.setPaintProperty(activeLayer+'_outlines','line-color','black');
                        };
                    };
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
                } else if (this.textContent == 'National Parks') {
                    if (map.getLayoutProperty('national_park','visibility') == 'visible') {
                      map.setLayoutProperty('national_park','visibility','none');
                    } else {
                      map.setLayoutProperty('national_park','visibility','visible');
                    };
                } else if (this.textContent == 'State Parks') {
                    if (map.getLayoutProperty('landuse','visibility') == 'visible') {
                      map.setLayoutProperty('landuse','visibility','none');
                    } else {
                      map.setLayoutProperty('landuse','visibility','visible');
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
                            if (clickedLayer != 'school_zones' && clickedLayer != 'villages' && clickedLayer != 'congress' && clickedLayer != 'senate' && clickedLayer != 'assembly' && clickedLayer != 'indian_territory' && clickedLayer != 'county' && clickedLayer != 'city_town') {
                              if (typeof map.getLayer(clickedLayer+'_fill') !== 'undefined') {
                                map.setLayoutProperty(clickedLayer+'_fill', 'visibility', 'none');
                              };
                            }
                            if (clickedLayer == 'precip') {
                              map.setLayoutProperty('precip_text','visibility','none')
                            };
                            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                            this.className = 'active';
                          } else {
                            if (clickedLayer == 'precip') {
                              map.setLayoutProperty('precip_text','visibility','visible')
                            };
                            if (clickedLayer == 'traffic') {
                              map.flyTo({
                                center: [-76.12, 43.05],
                                zoom: 8.5,
                                pitch: 10,
                                bearing: 0,
                              });
                            };
                            if (clickedLayer == 'census_1') {
                              if (map.getLayoutProperty('census_2_fill','visibility') == 'visible') {
                                window.alert("Close Advanced Census Layer before viewing Basic Census Layer");
                              } else {
                                map.setLayoutProperty('census_1_fill', 'visibility', 'visible');
                                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                                this.className = 'inactive';
                              };
                            } else if (clickedLayer == 'census_2') {
                              if (map.getLayoutProperty('census_1_fill','visibility') == 'visible') {
                                window.alert("Close Basic Census Layer before viewing Advanced Census Layer");
                              } else {
                                map.flyTo({
                                  center: [-76.12, 43.05],
                                  zoom: 11.5,
                                  pitch: 10,
                                  bearing: 0,
                                });
                                map.setLayoutProperty('census_2_fill', 'visibility', 'visible');
                                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                                this.className = 'inactive';
                              };
                            } else if (clickedLayer == 'agriculture') {
                              map.flyTo({
                                center: [-75.9, 42.9],
                                zoom: 8.5,
                                pitch: 10,
                                bearing: 0,
                              });
                              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                              this.className = 'inactive';
                            } else {
                              if (typeof map.getLayer(clickedLayer+'_fill') !== 'undefined') {
                                  map.setLayoutProperty(clickedLayer+'_fill', 'visibility', 'visible');
                              };
                              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                              this.className = 'inactive';
                            };
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

function geologyPopUp(map,e,lngLat) {
  var features = e.properties;
  var popup = new mapboxgl.Popup({closeButton: true,closeOnClick: true})
              .setLngLat(lngLat)
              .setHTML(
                      '<h3><u>Geologic Layer:</u> '+features['ROCKDESC']+'</h3>\n' +
                      '<h3><a  style="color:blue; text-decoration: underline" href="https://en.wikipedia.org/wiki/Special:Search?search='+features['ROCKDESC'].split("(")[0]+'" target="_blank">' + "See Wikipedia Page" + '</a></h3>'
                      )
              .addTo(map);
  return popup;
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
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}





//
