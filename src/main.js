/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
const stateScanner = function () {
    // 每 20 tick 运行一次
    if (Game.time % 20) return;

    if (!Memory.stats) Memory.stats = {};

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    Memory.stats.gplLevel = Game.gpl.level;
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed();
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket;
    //rcl
    Memory.stats.rclPrgress = Game.rooms["W41S22"].controller.progress / Game.rooms["W41S22"].controller.progressTotal;
};
//-----------------------------------------------------------------------------------------------------------------------

//role
import { harvester } from "./role.harvester";
import { builder } from "./role.builder";
import { upgrader } from "./role.upgrader";
import { repairer } from "./role.repairer";
import { carrier } from "./role.carrier";
import { customer } from "./role.customer";
import { mineral_harvester } from "./role.mineral.harvester";
import { attacker } from "./role/role.attacker";
//扩张
import { claimer } from "./role.claimer";
import { outHarvester } from "./Temporary/outHarvester";
import { H_Cer } from "./Temporary/H_Cer";
//structure
import { tower } from "./structure.tower";
//config
import role_config from "./creeps.config.json";
//
import rooms_config from "./config/rooms.config.json";
//############################################################################
// Game.property.logMarketHistory = function () {
//     Game.market.outgoingTransactions()
// }
//############################################################################
//判断任务队列是否改变-第一个任务完成
Memory.carryTarget = "";
Memory.repairTarget = "";

//缓存的路径|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|
// let path = [];
// if (Game.rooms["W41S23"]) {
//     path = Game.rooms["W41S23"].findPath(new RoomPosition(35, 42, "W41S23"), new RoomPosition(23, 0, "W41S23"));
//     path = Room.serializePath(path);
// }
// Memory.W41S23_energyTotop = "3541111188888888888811111111111111181111211111";
//
//W41S22房间的矿
let mineral_k = Game.rooms["W41S22"].find(FIND_MINERALS);

/**
 * 将字符串变为变量
 * @param {Object} obj 转变的字符串对象数组
 * @param {String} str 转变的字符串
 * @returns
 */
function getVerb(obj, str) {
    let arr = str.split(".");
    while (arr.length) {
        obj = obj[arr.shift()];
    }
    return obj;
}
/**
 * @description 将身体部件字符串转化为变量
 * @param {Array} str body组件字符串数组
 * @returns body组件数组
 */
function f_tov(str) {
    let r = [];
    for (const iterator of str) {
        switch (iterator) {
            case "WORK":
                r.push(WORK);
                break;
            case "CARRY":
                r.push(CARRY);
                break;
            case "MOVE":
                r.push(MOVE);
                break;
            case "ATTACK":
                r.push(ATTACK);
                break;
            case "RANGED_ATTACK":
                r.push(RANGED_ATTACK);
                break;
            case "HEAL":
                r.push(HEAL);
                break;
            case "CLAIM":
                r.push(CLAIM);
                break;
            case "TOUGH":
                r.push(TOUGH);
                break;
        }
    }
    return r;
}
/**
 * @description 按房间规划spawn的孵化
 * @param {Object} room room配置
 * @param {Object} role role配置
 */
function f_spawnCreep(room, role) {
    let index = Math.floor(Math.random() * 10);
    for (const spawn of spawnRoom[room.roomName]) {
        if (spawn.spawnCreep(f_tov(role.body), `${role.name}_${room.roomName}_${index}`, { memory: role.memory }) == 0) {
            return;
        }
    }
}
//原型方法>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//原型-切换目标对象(self-role对象数组)
Creep.prototype.switchTarget = function (self) {
    if (self.memory.targetIndex == 0) {
        self.memory.targetIndex += 1;
    } else if (self.memory.targetIndex == 1) {
        self.memory.targetIndex -= 1;
    }
};
//creep的被攻击发送生成attack方法
Creep.prototype.wasAttacked = function ({ _creep }) {
    if (_creep.hits < _creep.hitsMax) {
        attacker.run({ _creep });
    }
};
/**
 * @param {Number} creepNum 全局creep的数量，判断是否creep个数改变了
 */
let creepsNum;
let creepsRoomNum = {
    'W41S22': 0,
    'W41S23': 0
}
/**
 * @param {Object} creepsAll 全局所有creep
 */
let creepsAll = Game.creeps; //+++++
/**
 * @description 所有spawn按房间分
 * @param {Object} spawnRoom
 */
let spawnRoom = {};
for (const key in Game.rooms) {
    let spawnArray = [];
    for (const name in Game.spawns) {
        if (name.includes(key)) {
            spawnArray.push(Game.spawns[name]);
        }
    }
    spawnRoom[key] = spawnArray;
}

//loop主函数-----------------------------------------------------------------------------------------------------------------------
export const loop = function () {
    //兑换pielx
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    //
    let creeps = Game.creeps;
    let structures = Game.structures;
    //是否控制多个房间
    let moreRoom = Object.keys(Game.rooms).length > 1 ? true : false;
    /**
     * @description 检索Memory删除没用的数据
     */
    for (const key in Memory.creeps) {
        if (!creeps[key]) {
            delete Memory.creeps[key];
        }
    }
    /**
     * @description 分配structure_tower任务
     */
    for (const key in structures) {
        let structure = structures[key];
        if (structure.structureType == STRUCTURE_TOWER) {
            tower.run(structure, 15);
        }
    }
    //统计不同类型creep的对象数组方法
    function roleArray(role) {
        let arr = [];
        for (const key in creeps) {
            if (creeps[key].memory.role == role) {
                arr.push(creeps[key]);
            }
        }
        return arr;
    }
    //分配不同目标对象时需要的role对象数组
    let arr_harvester = roleArray("Harvester");
    // let arr_builder = roleArray("Builder");
    // let arr_upgrader = roleArray("Upgrader");
    let arr_repairer = roleArray("Repairer");
    let arr_carrier = roleArray("Carrier");
    //++++++
    /**
     * @description 检索creep按房间的不同种类的creep
     * @param {String} role 检索的memory的role（Harvester）
     * @returns {Object:{Array}} 房间名为key的不同种类的creep对象数组
     */
    function f_roleArrayRoom(role) {
        let arr = {};
        for (const Rname in Game.rooms) {
            let arrR = [];
            for (const key in creepsAll) {
                if (key.includes(Rname)) {
                    if (creepsAll[key].memory.role == role) {
                        arrR.push(creepsAll[key]);
                    }
                }
            }
            arr[Rname] = arrR;
        }
        return arr;
    }
    //分配不同目标对象时需要的role对象数组(按照room)
    let arrRoom_harvester = f_roleArrayRoom("Harvester");
    let arrRoom_builder = f_roleArrayRoom("Builder");
    let arrRoom_upgrader = f_roleArrayRoom("Upgrader");
    let arrRoom_repairer = f_roleArrayRoom("Repairer");
    let arrRoom_carrier = f_roleArrayRoom("Carrier");
    // console.log(JSON.stringify(arrRoom_harvester));
    //+++++++++
    //统计不同种类creep的名字数组(用于数量计算)【arr】
    function filter(role) {
        return Object.keys(creeps).filter((item) => {
            return creeps[item].memory.role == role;
        });
    }
    //增加role需要添加
    let num_harvester = filter("Harvester");
    let num_builder = filter("Builder");
    let num_upgrader = filter("Upgrader");
    let num_repairer = filter("Repairer");
    let num_carrier = filter("Carrier");
    let num_customer = filter("Customer");
    let num_mineralharvester = filter("MineralHarvester");
    let num_outharvester = filter("OutHarvester");
    let num_hcer = filter("HCer");
    let num = {
        num_harvester,
        num_builder,
        num_upgrader,
        num_repairer,
        num_carrier,
        num_customer,
        num_mineralharvester,
        num_outharvester,
        num_hcer,
    };
    //+++++++++++++++++++++++++++++++
    /**
     * @description 统计不同房间的不同种类的creep数量,孵化使用
     * @param {Object} numRoomCreep 按照房间分的
     */
    let numRoomCreep = {};
    for (const iterator of rooms_config.roomsData) {
        // numRoomCreep[iterator.roomName] = {};
        let obj = {};
        for (const key in iterator.creeps) {
            obj[key] = 0;
            for (const name in creepsAll) {

                if (name.includes(iterator.roomName) && name.includes(iterator.creeps[key].name)) {
                    obj[key] += 1;
                }
            }
        }
        numRoomCreep[iterator.roomName] = obj;
    }
    //一個房間的creep數量
    let numRoom = {};
    for (const room in numRoomCreep) {
        let num = 0;
        for (const name in numRoomCreep[room]) {
            num += numRoomCreep[room][name];
        }
        numRoom[room] = num;
    }
    //+++++++++++++++++++++++++++++++++++
    //所有房间的施工地
    let structure_site_all = [];
    for (const key in Game.rooms) {
        structure_site_all.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES));
    }

    //生成新creep完成时执行，分配targetIndex
    if (Object.keys(creeps).length != creepsNum) {
        creepsNum = Object.keys(creeps).length;
        //生成新的harvester时给所有harester分配index
        // if (role.name == 'carrier') {
        //获取最新的harvester对象数组
        let new_arr_harvester = roleArray("Harvester");
        //给harvester分配targetIndex
        for (const index in arr_harvester) {
            new_arr_harvester[index].memory.targetIndex = index % 2;
        }
        // }
    }
    //creep死亡和新生后执行，给harvester分配index
    for (const room in Game.rooms) {
        if (numRoom[room] != creepsRoomNum[room]) {
            creepsRoomNum[room] = numRoom[room];
            let new_arr_harvester = f_roleArrayRoom('Harvester')[room];
            for (const index in arrRoom_harvester[room]) {
                new_arr_harvester[index].memory.targetIndex = index % 2;
            }
        }
    }
    //
    //根据config生成新creep
    for (const key in role_config) {
        let role = role_config[key];
        if (getVerb(num, `num_${role.name}`).length < role.number) {
            let index = Math.floor(Math.random() * 10);
            //建造-有施工地时孵化
            if (structure_site_all.length > 0 && role.name == "builder") {
                Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            }
            //采矿-矿有资源时孵化
            else if (role.name == "mineralharvester" && mineral_k[0].mineralAmount > 0) {
                Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            }
            //外能量-有外房间时孵化
            else if (moreRoom && role.name == "outharvester") {
                Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W14S23_${index}`, { memory: role.memory });
            }
            //外房运输energy-有外房间时孵化
            else if (role.name == "hcer" && moreRoom) {
                Game.spawns["Spawn_W41S23"].spawnCreep(f_tov(role.body), `${role.name}_W41S23_${index}`, { memory: role.memory });
            }
            //除建筑/采矿/外能量
            else if (role.name != "builder" && role.name != "mineralharvester" && role.name != "outharvester") {
                Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            }
        }
    }
    //###############

    /**
     * @description 孵化creep
     */
    for (const room of rooms_config.roomsData) {
        //一个房间的配置
        let numCreep = numRoomCreep[room.roomName];
        // console.log(JSON.stringify(creepsAll));
        // console.log(JSON.stringify(numRoomCreep));
        for (const key in room.creeps) {
            //不同种类的creep配置
            let role = room.creeps[key];
            if (numCreep[key] < role.number) {
                //建造-有施工地时孵化
                if (structure_site_all.length > 0 && role.name == "builder") {
                    f_spawnCreep(room, role);
                }
                //采矿-矿有资源时孵化
                else if (role.name == "mineralharvester" && Game.rooms[room.roomName].find(FIND_MINERALS)[0].mineralAmount > 0) {
                    f_spawnCreep(room, role);
                }
                //外能量-有外房间时孵化
                else if (moreRoom && role.name == "outharvester") {
                    f_spawnCreep(room, role);
                }
                //外房运输energy-有外房间时孵化
                else if (role.name == "hcer" && moreRoom) {
                    f_spawnCreep(room, role);
                }
                //除建筑/采矿/外能量
                else if (role.name != "builder" && role.name != "mineralharvester" && role.name != "outharvester") {
                    f_spawnCreep(room, role);
                }
            }
        }
    }

    //###############
    //判断harvester是否担任运输任务
    let noCarrier = false;
    if (num_carrier.length == 0 && Game.spawns["Spawn0"].room.energyAvailable <= 300) {
        noCarrier = true;
    }

    //分配creep任务
    for (const key in creeps) {
        let _creep = creeps[key];
        //自身检查是否被攻击了并发出孵化attack指令
        _creep.wasAttacked({ _creep });

        //
        switch (_creep.memory.role) {
            case "Harvester":
                {
                    harvester.run({ _creep, noCarrier });
                }
                break;
            case "Builder":
                {
                    builder.run(_creep);
                }
                break;
            case "Upgrader":
                {
                    upgrader.run(_creep);
                }
                break;
            case "Repairer":
                {
                    repairer.run({ _creep, arr_repairer });
                }
                break;
            case "Carrier":
                {
                    carrier.run({ _creep, arr_carrier });
                }
                break;
            case "MineralHarvester":
                {
                    mineral_harvester.run({ _creep, _mineral: mineral_k });
                }
                break;
            //自定义
            case "Customer":
                {
                    customer.run({
                        _creep,
                        _target: _creep.room.terminal,
                        _origin: _creep.room.storage,
                        _method: "transfer",
                        _resource: RESOURCE_ENERGY,
                        //大于容量会停止widthdraw
                        _amount: 50,
                    });
                }
                break;

            //扩张
            case "Claimer":
                {
                    claimer.run({ _creep });
                }
                break;
            case "OutHarvester":
                {
                    outHarvester.run({ _creep, _room: Game.rooms["W41S23"] });
                }
                break;
            case "HCer": {
                H_Cer.run({ _creep, _room: Game.rooms["W41S23"] });
            }

            //
            default:
                break;
        }
        //存活时间小于10显示气泡
        if (_creep.ticksToLive < 10) _creep.say(_creep.ticksToLive);
        //
    }
    // Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE], 'Customer', { memory: { role: 'Customer' } });
    stateScanner();
};
