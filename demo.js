let a = function () {
    return {
        aa: 1
    }
}
let aa = a()
let bb = a()
aa.aa = 2;
bb.aa = 3;
console.log(aa);
console.log(bb);

let m = [1, 2, 4, 5, 6, 7];
let t = m.every(element => {
    return element > 3
})
console.log(t);

let creep = ['re0', 're1'];
let rea = true, reb = true;
let rec = false;
// let index0 = function () {
//     return { index: 0 }
// }
let repaire = false;
let move = true;
// let index = index0().index;
// let index0 = 1;
// let index1 = 0;
// let re = {
//     run: function (_creep) {
//         let arr = [1, 2, 3, 4, 5, 6];
//         if (rea) {
//             if (move) {
//                 // console.log(_creep, arr[index0], arr[index1]);

//                 if (index0 == 0) { index0 = index0 + 1 }
//                 else if (index0 == 1) { index0 = index0 - 1 };
//                 console.log(_creep, arr[index0], index0);
//             }

//         }

//     }
// }
// let re1 = {
//     run: function (_creep) {
//         let arr = [1, 2, 3, 4, 5, 6];
//         if (rea) {
//             if (move) {
//                 // console.log(_creep, arr[index0], arr[index1]);

//                 if (index1 == 0) { index1 = index1 + 1 }
//                 else if (index1 == 1) { index1 = index1 - 1 };
//                 console.log(_creep, arr[index1], index1);
//             }

//         }

//     }
// }
// re.run(creep[0]);
// re1.run(creep[1]);
// let hh = a
let l = 1, ll = 2;
function getDescendantProp(obj, desc) {
    var arr = desc.split('.');
    while (arr.length) {
        obj = obj[arr.shift()];
    }
    return obj;
}

// var obj = { l, ll };
// var propPath = "l"; // 例如返回 "a.b.c"
// var result = getDescendantProp(obj, propPath);
let json = {
    "harvester": {
        "body": [
            "WORK"
        ]
    }
}
let stt = [WORK, CARRY, MOVE];
let st = ['WORK', "CARRY"];
// function tov(str) {
//     let r = [];
//     for (const iterator of str) {
//         if (iterator == 'WORK') {
//             r.push(WORK);
//         } if (iterator == 'CARRY') {
//             r.push(CARRY);
//         }
//         if (iterator == "MOVE") {
//             r.push(MOVE);
//         }
//     }
//     return r;

// }
// let newstr = tov(st);
// console.log(newstr);
// console.log(JSON.stringify(st));
Game.spawns['Spawn0'].room.createConstructionSite(STRUCTURE_ROAD);