function setUpGlobalVars() {

    // Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VjZmFzdCIsImEiOiJjanVlbGRxbTUwNGVlNDlwcXRxNnFhYnlzIn0.-dc9uxSNW4TUYbC96E8zjA';

    // Initliaze base map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/secfast/cjupvuh6m155a1gqwh1d4ko6u',
      center: [-76.5, 42.65],
      zoom: 8,
      pitch: 10,
      bearing: 0,
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
    });

    var open_popup = false;

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

    var hoveredStateId =  null;

    // Load map
    map.on('load', function () {

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

        for (var key in county_dict) {
            map.addSource(key,{
                type: 'vector',
                url: county_dict[key][0]
            });


            map.addLayer({
              "id": key+"_fills",
              "type": "fill",
              "source": key,
              "source-layer": county_dict[key][1],
              'paint': {
                  'fill-opacity': .7,
                  'fill-outline-color': 'black',
                  'fill-color': [
                    "case",
                    ["boolean", ["feature-state","hover"], false],
                    "#F370EF",
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
                    ]],
                }
            },'3d-buildings');
            map.setLayoutProperty(key+'_fills', 'visibility', 'none');
        };


        // Display property features when fill layer parcels are clicked
        map.on('click', function (e) {
            var lngLat = e.lngLat;
            let f = map.queryRenderedFeatures(e.point);
            if (f.length) {
                for (i=0; i<f.length; i++) {
                    if (f[i].layer.id.includes('fills')) {
                        for (var key in county_dict) {
                            if (map.getLayoutProperty(key+'_fills','visibility') == 'visible') {
                                popup.remove();
                                if (hoveredStateId) {
                                    map.setFeatureState({source: key, id: hoveredStateId, sourceLayer: county_dict[key][1]}, { hover: false});
                                };
                                map.getCanvas().style.cursor = '';
                                hoveredStateId =  null;
                                break;
                            };
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
            } else {
                let f = map.queryRenderedFeatures(e.point);
                var on_fills = false;
                if (f.length) {
                    for (i=0; i<f.length; i++) {
                        if (f[i].layer.id.includes('fills')) {
                            on_fills = !on_fills;
                            var layer_id = f[i].layer.id.replace('_fills','');
                            if (hoveredStateId) {
                                map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, { hover: false});
                            };
                            // Display parcel information when hovered
                            map.getCanvas().style.cursor = 'pointer';
                            popup.setLngLat(e.lngLat)
                                // .setText(f[i].properties.PARCELADDR+'Parcel ID: '+f[i].properties.PRINT_KEY)
                                .setHTML("<p>"+f[i].properties.PARCELADDR+"</p><p>"+"Parcel ID: "+f[i].properties.PRINT_KEY+"</p>")
                                .addTo(map);

                            hoveredStateId = f[i].id;
                            map.setFeatureState({source: layer_id, id: hoveredStateId, sourceLayer: county_dict[layer_id][1]}, { hover: true});
                            break;
                        };
                    };
                    if (!on_fills) {
                        for (var key in county_dict) {
                            if (map.getLayoutProperty(key+'_fills','visibility') == 'visible') {
                                if (hoveredStateId) {
                                    map.setFeatureState({source: key, id: hoveredStateId, sourceLayer: county_dict[key][1]}, { hover: false});
                                };
                                map.getCanvas().style.cursor = '';
                                hoveredStateId =  null;
                                popup.remove();
                                break;
                            };
                        };
                    };
                };
            };
        });
    });

    // // Fly to address when searched, if it exists
    // document.getElementById('go').addEventListener('click', function (e) {
    //     for (var key in county_dict) {
    //         if (map.getLayoutProperty(key+'_fills','visibility') == 'visible') {
    //             var search_key = key;
    //             break;
    //         };
    //     };
    //
    //     var input_search = e.toElement.previousElementSibling.form[0].previousSibling.nextElementSibling.value;
    //     var relatedFeatures = map.queryRenderedFeatures(search_key+"_fills");
    //
    //     // Check if address matches entered search
    //     var found_address = false;
    //     for (var i=0; i < relatedFeatures.length; i++) {
    //         if (relatedFeatures[i].properties.PARCELADDR == input_search) {
    //             // Fly to address if match
    //             var coords = relatedFeatures[i].geometry.coordinates[0][0];
    //             map.flyTo({
    //               center: coords,
    //               zoom: 18,
    //               pitch: 10,
    //               bearing: 0,
    //             });
    //             found_address = !found_address;
    //             break
    //         }
    //     };
    //     if (!found_address) {
    //         alert("Address not found");
    //     };
    //
    // });
    //
    // // Fly to parcel when parcel ID is searched, if it exists
    // document.getElementById('parcel_go').addEventListener('click', function (e) {
    //     for (var key in county_dict) {
    //         if (map.getLayoutProperty(key+'_fills','visibility') == 'visible') {
    //             var search_key = key;
    //             break;
    //         };
    //     };
    //
    //     var input_search = e.toElement.previousElementSibling.form[0].previousSibling.nextElementSibling.value;
    //     var relatedFeatures = map.queryRenderedFeatures(search_key+"_fills");
    //
    //     // Check if parcel matches entered search
    //     var found_parcel = false;
    //     for (var i=0; i < relatedFeatures.length; i++) {
    //         if (relatedFeatures[i].properties.PRINT_KEY == '') continue;
    //         if (input_search == relatedFeatures[i].properties.PRINT_KEY) {
    //             // Fly to parcel if match
    //             var coords = relatedFeatures[i].geometry.coordinates[0][0];
    //             map.flyTo({
    //               center: coords,
    //               zoom: 18,
    //               pitch: 10,
    //               bearing: 0,
    //             });
    //             parcel_address = !parcel_address;
    //             break;
    //         };
    //     };
    //     if (!found_parcel) {
    //         alert("Parcel I.D. not found")
    //     };
    //
    // });

    // Handle input from county selection dropdown
    window.onclick = function(e) {
        if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show');
            }
        }
        if (e.composedPath()[2].matches('.dropdown')) {
            for (var key in county_dict) {
                if (e.toElement.text.toLowerCase() != key) {
                    map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                } else {
                    // Change layer to be visible and fly to given coordinates
                    var visibility = map.getLayoutProperty(key+'_fills', 'visibility');
                    if (visibility == 'visible') {
                        map.setLayoutProperty(key+'_fills', 'visibility', 'none');
                    } else {
                        map.flyTo({
                            center: county_dict[key][2],
                            zoom: 12,
                            pitch: 10,
                            bearing: 0,
                        });
                        map.setLayoutProperty(key+'_fills', 'visibility', 'visible');
                    };
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
    var popup = new mapboxgl.Popup()
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

















//
