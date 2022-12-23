function prepareTestData() {
	let arr = []
	arr.push([{				// №1
		Anna: 10,
		Olga: 1,
		Ivan: 5,
		}]);
	arr[0].push(16);
	arr.push([{				// №2
		Anna: 1,
		Raya: 10,
		Vera: 100,
		Elena: 1000,
		Nina: 10000,
		}]);
	arr[1].push(11111);
	arr.push([{				// №3
		key1: 3,
		key2: -2,
		}]);
	arr[2].push(1);
	arr.push([{				// №4
		key1: 7,
		key2: 0,
		}]);
	arr[3].push(7);
	arr.push([{				// №5
		key1: '10',
		key2: 5,
		}]);
	arr[4].push(15)
	arr.push([{				// №6
		key1: 4,
		key2: "",
		}]);
	arr[5].push(4);
	arr.push([{				// №7
		key1: NaN,
		key2: 6,
		}]);
	arr[6].push(6);
	arr.push([{				// №8
		key1: 8,
		key2: undefined,
		}]);
	arr[7].push(8);
	arr.push([{				// №9
		key1: 9,
		key2: {points: 5},
		}]);
	arr[8].push(9);
	function myFunc(){
		"HelloWorld";
	}
	arr.push([new myFunc ()]);		// №10
	arr[9].push(0);
	arr.push([false]);			// №11
	arr[10].push(0);
	arr.push([100]);			// №12
	arr[11].push(0);
	arr.push([{}]);				// №13
	arr[12].push(0);
	arr.push([,]);				// №14
	arr[13].push(0)
	arr.push([null]);			// №15
	arr[14].push(0);
	let b = {};
	for (var i=0; i<50; i++) {
		b["key"+i]=i;  
	}
	arr.push([b]);				// №16
	arr[15].push(1225);
	let mb = "я 1 МиБ txt ";
	for (var i = 0; i < 16; i++) {
		mb=mb+mb
	}
	arr.push([mb]);				// №17
	arr[16].push(0);
	return arr
}

export {prepareTestData}