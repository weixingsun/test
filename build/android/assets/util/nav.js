function navi(e,o){var i={weighting:"fastest",vehicle:"car",from:e,to:o,debug:!1};mf.getRouteAsyncCallback(i,function(e){if(0==e.error){var o=all_things_dictionary.PolyLine.route;0!==o&&mapView.removeLayer(o);var i=mapView.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});all_things_dictionary.PolyLine.route=i.id,Ti.API.info("test: nodes.size()="+e.nodes.length+",node0.sign="+e.nodes[0].sign+",node0.name="+e.nodes[0].name+",node0.pts="+e.nodes[0].pts),all_things_dictionary.Nodes=e.nodes}})}