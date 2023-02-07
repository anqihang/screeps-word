// // let a = function () {
// //     return {
// //         aa: 1
// //     }
// // }
// // let aa = a()
// // let bb = a()
// // aa.aa = 2;
// // bb.aa = 3;
// // console.log(aa);
// // console.log(bb);

// // let m = [1, 2, 4, 5, 6, 7];
// // let t = m.every(element => {
// //     return element > 3
// // })
// // console.log(t);

// // let creep = ['re0', 're1'];
// // let rea = true, reb = true;
// // let rec = false;
// // // let index0 = function () {
// // //     return { index: 0 }
// // // }
// // let repaire = false;
// // let move = true;
// // let index = index0().index;
// // let index0 = 1;
// // let index1 = 0;
// // let re = {
// //     run: function (_creep) {
// //         let arr = [1, 2, 3, 4, 5, 6];
// //         if (rea) {
// //             if (move) {
// //                 // console.log(_creep, arr[index0], arr[index1]);

// //                 if (index0 == 0) { index0 = index0 + 1 }
// //                 else if (index0 == 1) { index0 = index0 - 1 };
// //                 console.log(_creep, arr[index0], index0);
// //             }

// //         }

// //     }
// // }
// // let re1 = {
// //     run: function (_creep) {
// //         let arr = [1, 2, 3, 4, 5, 6];
// //         if (rea) {
// //             if (move) {
// //                 // console.log(_creep, arr[index0], arr[index1]);

// //                 if (index1 == 0) { index1 = index1 + 1 }
// //                 else if (index1 == 1) { index1 = index1 - 1 };
// //                 console.log(_creep, arr[index1], index1);
// //             }

// //         }

// //     }
// // }
// // re.run(creep[0]);
// // re1.run(creep[1]);
// // // let hh = a
// // let l = 1, ll = 2;
// // function getDescendantProp(obj, desc) {
// //     var arr = desc.split('.');
// //     while (arr.length) {
// //         obj = obj[arr.shift()];
// //     }
// //     return obj;
// // }

// // // var obj = { l, ll };
// // // var propPath = "l"; // 例如返回 "a.b.c"
// // // var result = getDescendantProp(obj, propPath);
// // let json = {
// //     "harvester": {
// //         "body": [
// //             "WORK"
// //         ]
// //     }
// // }
// // let stt = [WORK, CARRY, MOVE];
// // let st = ['WORK', "CARRY"];
// // function tov(str) {
// //     let r = [];
// //     for (const iterator of str) {
// //         if (iterator == 'WORK') {
// //             r.push(WORK);
// //         } if (iterator == 'CARRY') {
// //             r.push(CARRY);
// //         }
// //         if (iterator == "MOVE") {
// //             r.push(MOVE);
// //         }
// //     }
// //     return r;

// // }
// // let newstr = tov(st);
// // console.log(newstr);
// // console.log(JSON.stringify(st));
// // Game.spawns['Spawn0'].room.createConstructionSite(STRUCTURE_ROAD);
// // function a({ b = 1 }) {
// //     console.log(b);
// // }
// // a({ b: 2 })
// // [
// //     {
// //         created: 43257307,
// //         createdTimestamp: 1668297632902,
// //         type: "buy",
// //         amount: 5000,
// //         remainingAmount: 5000,
// //         resourceType: "K",
// //         price: 0.239,
// //         roomName: "E50S0",
// //         id: "637033a07022aaf62b9a8510",
// //     },

// //     {
// //         created: 43259334,
// //         createdTimestamp: 1668305352022,
// //         type: "buy",
// //         amount: 15000,
// //         remainingAmount: 15000,
// //         resourceType: "K",
// //         price: 0.291,
// //         roomName: "W40S0",
// //         id: "637051c818ab62a07f8d5824",
// //     }

// // ];
// // Game.market.calcTransactionCost(1000,'W41S23','W40S0')//540
// // Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_KEANIUM })
// // Game.market.deal('637051c818ab62a07f8d5824',1000,'W41S22')
// // let a = 'harvester'
// // let b = 'harvester_w41s22'
// // console.log(new RegExp(`^harvester`).test(b));
// // let a = 1,
// //     b = 1,
// //     c = 1;
// // console.log((a == b) == c)
// // // numRoomCreep
// // [
// //     {
// //         W41S22: { Harvester: 2, Carrier: 1, Builder: 0, Repairer: 0, Customer: 0, MineralHarvester: 0, Upgrader: 0 },
// //         W41S23: { Harvester: 1, Carrier: 1, Builder: 0, Upgrader: 0, Repairer: 0, Customer: 0, MineralHarvester: 0 },
// //     }
// // ];
// [
//     {
//         Harvester: {
//             name: "harvester",
//             number: 1,
//             body: ["WORK", "WORK", "WORK", "WORK", "WORK", "WORK", "CARRY", "CARRY", "MOVE", "MOVE", "MOVE", "MOVE"],
//             memory: { role: "Harvester", targetIndex: 0 },
//         },
//         Carrier: {
//             name: "carrier",
//             number: 2,
//             body: ["CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "MOVE", "MOVE", "MOVE"],
//             memory: { role: "Carrier", targetIndex: 0 },
//         },
//         Builder: {
//             name: "builder",
//             number: 2,
//             body: ["WORK", "WORK", "CARRY", "CARRY", "CARRY", "CARRY", "MOVE", "MOVE", "MOVE"],
//             memory: { role: "Builder" },
//         },
//         Upgrader: {
//             name: "upgrader",
//             number: 3,
//             body: ["WORK", "WORK", "CARRY", "CARRY", "CARRY", "CARRY", "MOVE", "MOVE", "MOVE"],
//             memory: { role: "Upgrader" },
//         },
//         Repairer: {
//             name: "repairer",
//             number: 1,
//             body: ["WORK", "WORK", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "MOVE", "MOVE", "MOVE", "MOVE"],
//             memory: { role: "Repairer", targetIndex: "0" },
//         },
//         Customer: {
//             name: "customer",
//             number: 0,
//             body: ["WORK", "WORK", "CARRY", "MOVE", "MOVE"],
//             memory: { role: "Customer" },
//             target: "_creep.room.controller",
//             origin: "_creep.room.storage",
//             method: "transfer",
//             resource: "RESOURCE_ENERGY",
//             amount: 100,
//         },
//         MineralHarvester: {
//             name: "mineralharvester",
//             number: 0,
//             body: ["WORK", "WORK", "WORK", "CARRY", "MOVE"],
//             memory: { role: "MineralHarvester" },
//         },
//         E_Attacker: {
//             name: "exploit_attacker",
//             number: 1,
//             targetRoom: "W42S23",
//             body: ["ATTACK", "MOVE"],
//             memory: { role: "E_Attacker" },
//         },
//     },
// ];
// ///
// [
//     {
//         createdTimestamp: 1671081916470,
//         type: "buy",
//         amount: 1000,
//         remainingAmount: 1000,
//         resourceType: "K",
//         price: 0.001,
//         roomName: "E47S44",
//         created: 44083420,
//         id: "639aafbcccd839eed555c8fd",
//     },
//     {
//         createdTimestamp: 1671985371925,
//         type: "buy",
//         amount: 10087,
//         remainingAmount: 20000,
//         resourceType: "K",
//         price: 0.001,
//         roomName: "E19S49",
//         created: 44387610,
//         id: "63a878dbbfdecf949ed541ff",
//     },
//     {
//         createdTimestamp: 1672313330375,
//         type: "buy",
//         amount: 1933,
//         remainingAmount: 1933,
//         resourceType: "K",
//         price: 0.663,
//         roomName: "W41N31",
//         created: 44500083,
//         id: "63ad79f2bfdecfd57899fc75",
//     },
//     {
//         createdTimestamp: 1672365025331,
//         type: "buy",
//         amount: 6020,
//         remainingAmount: 6020,
//         resourceType: "K",
//         price: 0.55,
//         roomName: "W18S56",
//         created: 44517635,
//         id: "63ae43e1bfdecf88c2e110e7",
//     },
//     {
//         createdTimestamp: 1672385826559,
//         type: "buy",
//         amount: 1358,
//         remainingAmount: 1358,
//         resourceType: "K",
//         price: 0.664,
//         roomName: "W18S57",
//         created: 44524675,
//         id: "63ae9522bfdecf1575fe75a5",
//     },
//     {
//         createdTimestamp: 1672386734675,
//         type: "buy",
//         amount: 2400,
//         remainingAmount: 2400,
//         resourceType: "K",
//         price: 0.664,
//         roomName: "E38S33",
//         created: 44524985,
//         id: "63ae98aebfdecf3229ffbd59",
//     },
// ];
// Connection connection = DriverManager.getConnection(URL, NAME, PASSWORD); try { connection.setAutoCommit(false);    PreparedStatement ps = connection.prepareStatement("update students set score=score-? where id=?"); ps.setObject(1, 50); ps.setObject(2, 999); System.out.println(ps.executeUpdate());    PreparedStatement ps2 = connection.prepareStatement("update studentss set score=score+? where id=?"); ps2.setObject(1, 50); ps2.setObject(2, 998); System.out.println(ps2.executeUpdate()); connection.commit(); } catch (SQLException e) {
//     connection.rollback();
// }finally { connection.setAutoCommit(true); connection.close(); }

let a = [3, 1, 7, 2, 4, 6, 5]
// left 0, right, 5
// arr[i] 1, arr[p] 2
var aa = function (arr, left, right) {
    var p = left, index = p + 1;
    for (var i = index; i <= right; i++) {
        if (arr[i] < arr[p]) {
            swap(arr, i, index);
            index++;
        }

    }
    console.log(index);
    swap(arr, p, index - 1);
    console.log(index - 1);
    console.log(a);
}
var swap = function (arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
aa(a, 0, a.length - 1);