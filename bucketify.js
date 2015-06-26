var ss=require('simple-statistics'),
	nr=require('./');

module.exports=function sortIntoBuckets() {
	var values=[], stdDeviation, resultsToBeSorted=[], key, invertedResults={}, buckets={},
		distance, chi;
	ss.mixin();

	for( key in nr ) {
		resultsToBeSorted.push({module:key, rank:nr[key]});
	}

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
			chi=Math.ceil(Math.abs(distance/stdDeviation))*(distance/Math.abs(distance));
			if( chi > 2 ) chi=2;
			if( chi < -2) chi=-2;
			if( !buckets[chi] )
				buckets[chi]=[];
			buckets[chi].push(resultsToBeSorted[mod]);
		}
	}

	//the +2 chi bucket are the only ones we're going to gather git statistics for
	return buckets;
};