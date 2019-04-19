function setUpGlobalVars(){

    // Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjZmFzdCIsImEiOiJjanVlbGRxbTUwNGVlNDlwcXRxNnFhYnlzIn0.-dc9uxSNW4TUYbC96E8zjA';

    // Initliaze base map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/secfast/cjunsfgnx1b6p1fn1y0ldamku',
      center: [-76.5, 42.65],
      zoom: 9
    });

    // Load map
    map.on('load', function () {

      // Add TOMPKINS COUNTY
      // Add fill layer
      map.addLayer({
          "id": "tompkins_fills",
          "type": "fill",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.bxmtsg75'
          },
          "source-layer": "tompkins-6devsn",
          'paint': {
              'fill-opacity': .7,
              'fill-outline-color': 'black',
              'fill-color': [
                'interpolate', ['linear'],['get','FULL_MV'],
                  0, '#18a9ec',
                  50000, '#5ae7e5',
                  100000, '#5ae79e',
                  300000, '#b1e75a',
                  600000, '#e7cd5a',
                  800000, '#e7925a',
                  1200000, '#e7875a',
                  5000000, '#e75a5a',
                ],
          }
      },'water');

      // Add point layer
      map.addLayer({
          "id": "tompkins_points",
          "type": "symbol",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.bxmtsg75'
          },
          "source-layer": "tompkins-6devsn",
          'layout': {
              "text-field": ['concat',['get','PARCELADDR'],'\n','Parcel ID: ',['get','CT_SWIS'],'-',['get','PRINT_KEY']],
              "text-size": [
                    'interpolate', ['linear'],['zoom'],
                    14, 0,
                    15, 1,
                    16, 9,
                    24, 14
              ],
          }
      },'water');
      map.setLayoutProperty('tompkins_fills', 'visibility', 'none');
      map.setLayoutProperty('tompkins_points', 'visibility', 'none');

      // Add CAYUGA COUNTY
      // Add fill layer
      map.addLayer({
          "id": "cayuga_fills",
          "type": "fill",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.6ailnamb'
          },
          "source-layer": "cayuga-dnav44",
          'paint': {
              'fill-opacity': .7,
              'fill-outline-color': 'black',
              'fill-color': [
                'interpolate', ['linear'],['get','FULL_MV'],
                  0, '#18a9ec',
                  50000, '#5ae7e5',
                  100000, '#5ae79e',
                  300000, '#b1e75a',
                  600000, '#e7cd5a',
                  800000, '#e7925a',
                  1200000, '#e7875a',
                  5000000, '#e75a5a',
                ],
          }
      },'water');

      // Add point layer
      map.addLayer({
          "id": "cayuga_points",
          "type": "symbol",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.6ailnamb'
          },
          "source-layer": "cayuga-dnav44",
          'layout': {
              "text-field": ['concat',['get','PARCELADDR'],'\n','Parcel ID: ',['get','CT_SWIS'],'-',['get','PRINT_KEY']],
              "text-size": [
                    'interpolate', ['linear'],['zoom'],
                    14, 0,
                    15, 1,
                    16, 9,
                    24, 14
              ],
          }
      },'water');
      map.setLayoutProperty('cayuga_fills', 'visibility', 'none');
      map.setLayoutProperty('cayuga_points', 'visibility', 'none');

      // Add CORTLAND COUNTY
      // Add fill layer
      map.addLayer({
          "id": "cortland_fills",
          "type": "fill",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.7u5fims4'
          },
          "source-layer": "cortland-75081d",
          'paint': {
              'fill-opacity': .7,
              'fill-outline-color': 'black',
              'fill-color': [
                'interpolate', ['linear'],['get','FULL_MV'],
                  0, '#18a9ec',
                  50000, '#5ae7e5',
                  100000, '#5ae79e',
                  300000, '#b1e75a',
                  600000, '#e7cd5a',
                  800000, '#e7925a',
                  1200000, '#e7875a',
                  5000000, '#e75a5a',
                ],
          }
      },'water');

      // Add point layer
      map.addLayer({
          "id": "cortland_points",
          "type": "symbol",
          "source": {
              type: 'vector',
              url: 'mapbox://secfast.7u5fims4'
          },
          "source-layer": "cortland-75081d",
          'layout': {
              "text-field": ['concat',['get','PARCELADDR'],'\n','Parcel ID: ',['get','CT_SWIS'],'-',['get','PRINT_KEY']],
              "text-size": [
                    'interpolate', ['linear'],['zoom'],
                    14, 0,
                    15, 1,
                    16, 9,
                    24, 14
              ],
          }
      },'water');
      map.setLayoutProperty('cortland_fills', 'visibility', 'none');
      map.setLayoutProperty('cortland_points', 'visibility', 'none');


        // Display property features when tompkins_points are clicked
        map.on('click', 'tompkins_points', function (e) {
            var lngLat = e.lngLat;
            var features = map.queryRenderedFeatures(e.point)[0].properties;
            var street_view_url = "http://maps.google.com/?cbll="+lngLat.lat+","+lngLat.lng+"&cbp=12,20.09,,0,5&layer=c"
            var value_item = features['FULL_MV'].toString();
            var length = value_item.length;

            // Show value if information exists
            if (features['YR_BLT'] == 0) {
                var year_built = '-';
            } else {
                var year_built = features['YR_BLT'];
            }

            // Show value if information exists
            if (features['SQFT_LIV'] == 0) {
                var square_feet = '-';
            } else {
                var num_length = features['SQFT_LIV'].toString().length;
                if (num_length > 3) {
                    var square_feet = features['SQFT_LIV'].toString().slice(0,num_length-3) + ',' + features['SQFT_LIV'].toString().slice(num_length-3,num_length);
                } else {
                    var square_feet = features['SQFT_LIV'];
                }
            }

            // Format property value assessment
            if (length > 9) {
                var market_value = value_item.slice(0,length-9) + ',' + value_item.slice(length-9,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 6) {
                var market_value = value_item.slice(0,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 3) {
                var market_value = value_item.slice(0,length-3) + ',' + value_item.slice(length-3,length);
            } else {
                var market_value = value_item;
            }

            // Show value if information exists
            if (features['NBR_BEDRM'] == 0) {
                var beds = '-';
            } else {
                var beds = features['NBR_BEDRM'];
            }

            // Show value if information exists
            if (features['NBR_F_BATH'] == 0) {
                var baths = '-';
            } else {
                var baths = features['NBR_F_BATH'];
            }


            // Pop-up with information on click
            new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(
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
            });

        // Change mouse when on point
        map.on('mouseenter', 'tompkins_points', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change mouse backwhen it leaves point
        map.on('mouseleave', 'tompkins_points', function () {
            map.getCanvas().style.cursor = '';
        });


        map.on('click', 'cayuga_points', function (e) {
            var lngLat = e.lngLat;
            var features = map.queryRenderedFeatures(e.point)[0].properties;
            var street_view_url = "http://maps.google.com/?cbll="+lngLat.lat+","+lngLat.lng+"&cbp=12,20.09,,0,5&layer=c"
            var value_item = features['FULL_MV'].toString();
            var length = value_item.length;

            // Show value if information exists
            if (features['YR_BLT'] == 0) {
                var year_built = '-';
            } else {
                var year_built = features['YR_BLT'];
            }

            // Show value if information exists
            if (features['SQFT_LIV'] == 0) {
                var square_feet = '-';
            } else {
                var num_length = features['SQFT_LIV'].toString().length;
                if (num_length > 3) {
                    var square_feet = features['SQFT_LIV'].toString().slice(0,num_length-3) + ',' + features['SQFT_LIV'].toString().slice(num_length-3,num_length);
                } else {
                    var square_feet = features['SQFT_LIV'];
                }
            }

            // Format property value assessment
            if (length > 9) {
                var market_value = value_item.slice(0,length-9) + ',' + value_item.slice(length-9,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 6) {
                var market_value = value_item.slice(0,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 3) {
                var market_value = value_item.slice(0,length-3) + ',' + value_item.slice(length-3,length);
            } else {
                var market_value = value_item;
            }

            // Show value if information exists
            if (features['NBR_BEDRM'] == 0) {
                var beds = '-';
            } else {
                var beds = features['NBR_BEDRM'];
            }

            // Show value if information exists
            if (features['NBR_F_BATH'] == 0) {
                var baths = '-';
            } else {
                var baths = features['NBR_F_BATH'];
            }


            // Pop-up with information on click
            new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(
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
            });

        // Change mouse when on point
        map.on('mouseenter', 'cayuga_points', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change mouse backwhen it leaves point
        map.on('mouseleave', 'cayuga_points', function () {
            map.getCanvas().style.cursor = '';
        });
        map.on('click', 'cortland_points', function (e) {
            var lngLat = e.lngLat;
            var features = map.queryRenderedFeatures(e.point)[0].properties;
            var street_view_url = "http://maps.google.com/?cbll="+lngLat.lat+","+lngLat.lng+"&cbp=12,20.09,,0,5&layer=c"
            var value_item = features['FULL_MV'].toString();
            var length = value_item.length;

            // Show value if information exists
            if (features['YR_BLT'] == 0) {
                var year_built = '-';
            } else {
                var year_built = features['YR_BLT'];
            }

            // Show value if information exists
            if (features['SQFT_LIV'] == 0) {
                var square_feet = '-';
            } else {
                var num_length = features['SQFT_LIV'].toString().length;
                if (num_length > 3) {
                    var square_feet = features['SQFT_LIV'].toString().slice(0,num_length-3) + ',' + features['SQFT_LIV'].toString().slice(num_length-3,num_length);
                } else {
                    var square_feet = features['SQFT_LIV'];
                }
            }

            // Format property value assessment
            if (length > 9) {
                var market_value = value_item.slice(0,length-9) + ',' + value_item.slice(length-9,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 6) {
                var market_value = value_item.slice(0,length-6) + ',' + value_item.slice(length-6,length-3) + ',' + value_item.slice(length-3,length);
            } else if (length > 3) {
                var market_value = value_item.slice(0,length-3) + ',' + value_item.slice(length-3,length);
            } else {
                var market_value = value_item;
            }

            // Show value if information exists
            if (features['NBR_BEDRM'] == 0) {
                var beds = '-';
            } else {
                var beds = features['NBR_BEDRM'];
            }

            // Show value if information exists
            if (features['NBR_F_BATH'] == 0) {
                var baths = '-';
            } else {
                var baths = features['NBR_F_BATH'];
            }


            // Pop-up with information on click
            new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setHTML(
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
            });

        // Change mouse when on point
        map.on('mouseenter', 'cortland_points', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change mouse backwhen it leaves point
        map.on('mouseleave', 'cortland_points', function () {
            map.getCanvas().style.cursor = '';
        });

    });

    // Fly to address when searched, if it exists
    document.getElementById('go').addEventListener('click', function (e) {
        var tompkins_vis = map.getLayoutProperty('tompkins_fills', 'visibility');
        var cayuga_vis = map.getLayoutProperty('cayuga_fills', 'visibility');
        var cortland_vis = map.getLayoutProperty('cortland_fills', 'visibility');
        if (tompkins_vis == 'visible') {
            var search_layer = "tompkins"
            var layer_source = "tompkins-6devsn"
        } else if (cayuga_vis == 'visible') {
            var search_layer = "cayuga"
            var layer_source = "cayuga-dnav44"
        } else if (cortland_vis == 'visible') {
            var search_layer = "cortland"
            var layer_source = "cortland-75081d"
        } else {
            var search_layer = "cortland"
            var layer_source = "cortland-75081d"
        }
        var input_search = e.toElement.previousElementSibling.form[0].previousSibling.nextElementSibling.value;
        var replaced_name = false;

        // street_endings = [' Road',' road',' Rd',' rd',' Street',' street', ' St', ' Lane',' lane', ' Ln',' Avenue',' avenue',' Ave',' ave', ' Place', ' place',' Circle',' circle',' Blvd', 'blvd',' Drive',' drive']
        // Replace street endings if included in search
        // for (var j=0; j<street_endings.length; j++) {
            // if (input_search.includes(street_endings[j])) {
                // var new_search = input_search.replace(street_endings[j],'');
                // replaced_name = !replaced_name;
                // break
            // }
        // }
        if (!replaced_name) {
            var new_search = input_search;
        }

        // Retrieve source features to match address
        var relatedFeatures = map.querySourceFeatures(search_layer+"_points",{
            sourceLayer: layer_source,
        });

        // Check if address matches entered search
        var found_address = false;
        for (var i=0; i < relatedFeatures.length; i++) {
            if (relatedFeatures[i].properties.PARCELADDR == new_search) {
                // Fly to address if match
                var coords = relatedFeatures[i].geometry.coordinates[0][0];
                map.flyTo({
                  center: coords,
                  zoom: 18
                });
                found_address = !found_address;
                break
            }
        }
        if (!found_address) {
            alert("Address not found");
        }

    });
    document.getElementById('parcel_go').addEventListener('click', function (e) {
        var tompkins_vis = map.getLayoutProperty('tompkins_fills', 'visibility');
        var cayuga_vis = map.getLayoutProperty('cayuga_fills', 'visibility');
        var cortland_vis = map.getLayoutProperty('cortland_fills', 'visibility');
        if (tompkins_vis == 'visible') {
            var search_layer = "tompkins"
            var layer_source = "tompkins-6devsn"
        } else if (cayuga_vis == 'visible') {
            var search_layer = "cayuga"
            var layer_source = "cayuga-dnav44"
        } else if (cortland_vis == 'visible') {
            var search_layer = "cortland"
            var layer_source = "cortland-75081d"
        } else {
            var search_layer = "cortland"
            var layer_source = "cortland-75081d"
        }

        var input_search = e.toElement.previousElementSibling.form[0].previousSibling.nextElementSibling.value;
        var relatedFeatures = map.querySourceFeatures(search_layer+"_points",{
            sourceLayer: layer_source,
        });

        // Check if parcel matches entered search
        var found_parcel = false;
        for (var i=0; i < relatedFeatures.length; i++) {
            if (relatedFeatures[i].properties.PRINT_KEY == '') continue;
            if (input_search.includes(relatedFeatures[i].properties.PRINT_KEY)) {
                // Fly to parcel if match
                var coords = relatedFeatures[i].geometry.coordinates[0][0];
                map.flyTo({
                  center: coords,
                  zoom: 18
                });
                parcel_address = !parcel_address;
                break;
            }
        }
        if (!found_parcel) {
            alert("Parcel I.D. not found")
        }

    });
    window.onclick = function(e) {
        if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show');
            }
        }


        switch (e.toElement.text) {
            case "Tompkins":
                map.setLayoutProperty('cayuga_fills', 'visibility', 'none');
                map.setLayoutProperty('cayuga_points', 'visibility', 'none');
                map.setLayoutProperty('cortland_fills', 'visibility', 'none');
                map.setLayoutProperty('cortland_points', 'visibility', 'none');

                var visibility = map.getLayoutProperty('tompkins_fills', 'visibility');
                if (visibility == 'visible') {
                  map.setLayoutProperty('tompkins_fills', 'visibility', 'none');
                  map.setLayoutProperty('tompkins_points', 'visibility', 'none');
                } else {
                  map.flyTo({
                    center: [-76.5, 42.45],
                    zoom: 14.5
                  });
                  map.setLayoutProperty('tompkins_fills', 'visibility', 'visible');
                  map.setLayoutProperty('tompkins_points', 'visibility', 'visible');
                }
                break;
            case "Cayuga":
                map.setLayoutProperty('tompkins_fills', 'visibility', 'none');
                map.setLayoutProperty('tompkins_points', 'visibility', 'none');
                map.setLayoutProperty('cortland_fills', 'visibility', 'none');
                map.setLayoutProperty('cortland_points', 'visibility', 'none');

                var visibility = map.getLayoutProperty('cayuga_fills', 'visibility');
                if (visibility == 'visible') {
                  map.setLayoutProperty('cayuga_fills', 'visibility', 'none');
                  map.setLayoutProperty('cayuga_points', 'visibility', 'none');
                } else {
                  map.flyTo({
                    center: [-76.56, 42.93],
                    zoom: 14.5
                  });
                  map.setLayoutProperty('cayuga_fills', 'visibility', 'visible');
                  map.setLayoutProperty('cayuga_points', 'visibility', 'visible');
                }
                break;
            case "Cortland":
                map.setLayoutProperty('tompkins_fills', 'visibility', 'none');
                map.setLayoutProperty('tompkins_points', 'visibility', 'none');
                map.setLayoutProperty('cayuga_fills', 'visibility', 'none');
                map.setLayoutProperty('cayuga_points', 'visibility', 'none');

                var visibility = map.getLayoutProperty('cortland_fills', 'visibility');
                if (visibility == 'visible') {
                  map.setLayoutProperty('cortland_fills', 'visibility', 'none');
                  map.setLayoutProperty('cortland_points', 'visibility', 'none');
                } else {
                  map.flyTo({
                    center: [-76.18, 42.60],
                    zoom: 14.5
                  });
                  map.setLayoutProperty('cortland_fills', 'visibility', 'visible');
                  map.setLayoutProperty('cortland_points', 'visibility', 'visible');
                }
                break;
        }
    };
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

















//
