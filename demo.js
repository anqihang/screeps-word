// let a = function () {
//     return {
//         aa: 1
//     }
// }
// let aa = a()
// let bb = a()
// aa.aa = 2;
// bb.aa = 3;
// console.log(aa);
// console.log(bb);

// let m = [1, 2, 4, 5, 6, 7];
// let t = m.every(element => {
//     return element > 3
// })
// console.log(t);

// let creep = ['re0', 're1'];
// let rea = true, reb = true;
// let rec = false;
// // let index0 = function () {
// //     return { index: 0 }
// // }
// let repaire = false;
// let move = true;
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
// // let hh = a
// let l = 1, ll = 2;
// function getDescendantProp(obj, desc) {
//     var arr = desc.split('.');
//     while (arr.length) {
//         obj = obj[arr.shift()];
//     }
//     return obj;
// }

// // var obj = { l, ll };
// // var propPath = "l"; // 例如返回 "a.b.c"
// // var result = getDescendantProp(obj, propPath);
// let json = {
//     "harvester": {
//         "body": [
//             "WORK"
//         ]
//     }
// }
// let stt = [WORK, CARRY, MOVE];
// let st = ['WORK', "CARRY"];
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
// Game.spawns['Spawn0'].room.createConstructionSite(STRUCTURE_ROAD);
// function a({ b = 1 }) {
//     console.log(b);
// }
// a({ b: 2 })
// [
//     {
//         created: 43257307,
//         createdTimestamp: 1668297632902,
//         type: "buy",
//         amount: 5000,
//         remainingAmount: 5000,
//         resourceType: "K",
//         price: 0.239,
//         roomName: "E50S0",
//         id: "637033a07022aaf62b9a8510",
//     },

//     {
//         created: 43259334,
//         createdTimestamp: 1668305352022,
//         type: "buy",
//         amount: 15000,
//         remainingAmount: 15000,
//         resourceType: "K",
//         price: 0.291,
//         roomName: "W40S0",
//         id: "637051c818ab62a07f8d5824",
//     }

// ];
// Game.market.calcTransactionCost(1000,'W41S23','W40S0')//540
// Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_KEANIUM })
// Game.market.deal('637051c818ab62a07f8d5824',1000,'W41S22')
[
    {
        outharvester5: {
            room: { name: "W41S23", energyAvailable: 1300, energyCapacityAvailable: 1300, visual: { roomName: "W41S23" } },
            pos: { x: 42, y: 28, roomName: "W41S23" },
            id: "638cacc76798ff82972b1132",
            name: "outharvester5",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 467,
            carryCapacity: 300,
            carry: { energy: 102 },
            store: { energy: 102 },
            fatigue: 0,
            hits: 1200,
            hitsMax: 1200,
        },
        mineralharvester_W41S22_9: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 40, y: 24, roomName: "W41S22" },
            id: "638cad32374c10a0ea9d08f5",
            name: "mineralharvester_W41S22_9",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 482,
            carryCapacity: 50,
            carry: { K: 36 },
            store: { K: 36 },
            fatigue: 0,
            hits: 500,
            hitsMax: 500,
        },
        repairer_W41S22_3: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 17, y: 32, roomName: "W41S22" },
            id: "638cb076f7f9fb6db1082730",
            name: "repairer_W41S22_3",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 774,
            carryCapacity: 300,
            carry: { energy: 185 },
            store: { energy: 185 },
            fatigue: 0,
            hits: 1200,
            hitsMax: 1200,
        },
        upgrader_W41S22_3: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 27, y: 38, roomName: "W41S22" },
            id: "638cb0e993fe9f3ff03dfc8f",
            name: "upgrader_W41S22_3",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 801,
            carryCapacity: 200,
            carry: { energy: 150 },
            store: { energy: 150 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        upgrader_W41S22_0: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 24, y: 33, roomName: "W41S22" },
            id: "638cb15a73e10a5c5b8e45a1",
            name: "upgrader_W41S22_0",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 838,
            carryCapacity: 200,
            carry: { energy: 32 },
            store: { energy: 32 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        hcer_W41S23_6: {
            room: { name: "W41S23", energyAvailable: 1300, energyCapacityAvailable: 1300, visual: { roomName: "W41S23" } },
            pos: { x: 25, y: 29, roomName: "W41S23" },
            id: "638cb2336af449ae7998d2ad",
            name: "hcer_W41S23_6",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 903,
            carryCapacity: 150,
            carry: { energy: 20 },
            store: { energy: 20 },
            fatigue: 0,
            hits: 700,
            hitsMax: 700,
        },
        upgrader_W41S22_2: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 23, y: 33, roomName: "W41S22" },
            id: "638cb237b58e7273c649c7ce",
            name: "upgrader_W41S22_2",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 910,
            carryCapacity: 200,
            carry: { energy: 132 },
            store: { energy: 132 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        upgrader_W41S22_8: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 27, y: 37, roomName: "W41S22" },
            id: "638cb28b7a86a47579ce84c4",
            name: "upgrader_W41S22_8",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 938,
            carryCapacity: 200,
            carry: { energy: 6 },
            store: { energy: 6 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        repairer_W41S22_8: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 34, y: 24, roomName: "W41S22" },
            id: "638cb2e9441995693a11d98d",
            name: "repairer_W41S22_8",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 975,
            carryCapacity: 300,
            carry: { energy: 233 },
            store: { energy: 233 },
            fatigue: 0,
            hits: 1200,
            hitsMax: 1200,
        },
        upgrader_W41S22_5: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 26, y: 33, roomName: "W41S22" },
            id: "638cb35b47e152562c2b66bb",
            name: "upgrader_W41S22_5",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1002,
            carryCapacity: 200,
            carry: { energy: 116 },
            store: { energy: 116 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        upgrader_W41S22_1: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 27, y: 34, roomName: "W41S22" },
            id: "638cb3b67cb703819000a851",
            name: "upgrader_W41S22_1",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1032,
            carryCapacity: 200,
            carry: { energy: 164 },
            store: { energy: 164 },
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        carrier_W41S22_3: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 29, y: 31, roomName: "W41S22" },
            id: "638cb4088144fdcadce500d0",
            name: "carrier_W41S22_3",
            body: [
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1059,
            carryCapacity: 300,
            carry: {},
            store: {},
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        carrier_W41S22_8: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 26, y: 27, roomName: "W41S22" },
            id: "638cb458f7f9fb134908285c",
            name: "carrier_W41S22_8",
            body: [
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1086,
            carryCapacity: 300,
            carry: {},
            store: {},
            fatigue: 0,
            hits: 900,
            hitsMax: 900,
        },
        harvester_W41S22_4: {
            room: { name: "W41S22", energyAvailable: 5600, energyCapacityAvailable: 5600, visual: { roomName: "W41S22" } },
            pos: { x: 30, y: 24, roomName: "W41S22" },
            id: "638cb4aabae3d583532940fe",
            name: "harvester_W41S22_4",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1122,
            carryCapacity: 100,
            carry: { energy: 48 },
            store: { energy: 48 },
            fatigue: 0,
            hits: 1200,
            hitsMax: 1200,
        },
        harvester_W41S23_1: {
            room: { name: "W41S23", energyAvailable: 1300, energyCapacityAvailable: 1300, visual: { roomName: "W41S23" } },
            pos: { x: 35, y: 42, roomName: "W41S23" },
            id: "638cb4b95fd63573f256760a",
            name: "harvester_W41S23_1",
            body: [
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1100,
            carryCapacity: 50,
            carry: { energy: 50 },
            store: { energy: 50 },
            fatigue: 0,
            hits: 300,
            hitsMax: 300,
        },
        outharvester_W14S23_3: {
            room: { name: "W41S23", energyAvailable: 1300, energyCapacityAvailable: 1300, visual: { roomName: "W41S23" } },
            pos: { x: 43, y: 28, roomName: "W41S23" },
            id: "638cb626ebbe087bb7ec7675",
            name: "outharvester_W14S23_3",
            body: [
                { type: "work", hits: 100 },
                { type: "work", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "carry", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
                { type: "move", hits: 100 },
            ],
            my: true,
            owner: { username: "AnQiHang" },
            spawning: false,
            ticksToLive: 1243,
            carryCapacity: 300,
            carry: { energy: 264 },
            store: { energy: 264 },
            fatigue: 0,
            hits: 1200,
            hitsMax: 1200,
        },
    },
];
console.log('harvester_W41S23'.includes('W41S22') && 'harvester_W41S23'.includes('harvester'))
