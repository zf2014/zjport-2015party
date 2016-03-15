
var letterPos = [];
var i = 0;

var $container = $('#J-gridContainer');

var winDimension = [1352, 728]

var d = 16;

var wSize = winDimension[0]/d;
var hSize = winDimension[1]/d;

wSize = (parseInt(wSize) === wSize) ? wSize : Math.round(wSize + 0.5)
hSize = (parseInt(hSize) === hSize) ? hSize : Math.round(hSize + 0.5)


var wL, hL;


while(wSize--){
	hL = hSize;
	while(hL--){
		createGrid([wSize, hL]);
	}
}


$container.on('click', '.cell', function(e){
	var $that = $(this);
	e.preventDefault();
	$that.toggleClass('selected');
});



function createGrid(no){
	$('<div class="cell"></div>').appendTo($container).data('no', no);
}



function toJSON(){
	letterPos = [];
	$container.find('.selected').each(function(node){
		var $that = $(this),
			pos
		;
		pos = $that.position();
		letterPos.push({left: pos.left, top: pos.top, index: $that.index()});
	});
	console.log(JSON.stringify(letterPos));
}


function reversedJSON(words){
	var reqsPrefix = '/json/letter-of-',
		reqSuffix = '.json';


	$.when($.ajax(reqsPrefix + words + reqSuffix)).done(function(cellList){
			var letters = [],
				// args = [].slice.call(arguments, 0),
				i = 0
			;

			cellList.forEach(function(cell){
				$container.find('.cell:nth(' + cell.index + ')').addClass('selected');
			})
		})

}