var ss=require('simple-statistics'),
	nr=require('./noderank.json');

module.exports=function sortIntoBuckets() {
	var values=[], stdDeviation, resultsToBeSorted=[], key, invertedResults={}, buckets={},
		distance, sigma, debug=require('debug')("noderank-nightly:sortIntoBuckets");
	debug("mixing-in simple-statistics");
	ss.mixin();
	debug("nr %j", nr);
	for( key in nr ) {
		resultsToBeSorted.push({module:key, rank:nr[key]});
	}
	debug("sorting");

	resultsToBeSorted.sort(function(a,b) {
		return b.rank-a.rank;
	});

	//invert the results
	for( key in nr ) { 
		invertedResults[nr[key]]=key; 
	}
	for( key in invertedResults ) {
		values.push(parseFloat(key));
	}
	//value is now an array of ranks
	//calculate some simple statistics
	median=values.median();
	sum=values.sum();
	stdDeviation=values.standard_deviation();

	for( mod in resultsToBeSorted ) {
		//calculate distance from the median
		distance=resultsToBeSorted[mod].rank-median;
		if(distance) {
			sigma=Math.ceil(Math.abs(distance/stdDeviation))*(distance/Math.abs(distance));
			if( !buckets[sigma] )
				buckets[sigma]=[];
			buckets[sigma].push(resultsToBeSorted[mod]);
		}
	}
	return buckets;
};