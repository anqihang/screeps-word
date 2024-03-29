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
//

// Game.prototype.lo = function () {
//     console.log('a');
// }
//-----------------------------------------------------------------------------------------------------------------------
//role
import { harvester } from "./role/role.harvester";
import { builder } from "./role/role.builder";
import { upgrader } from "./role/role.upgrader";
import { repairer } from "./role/role.repairer";
import { carrier } from "./role/role.carrier";
import { customer } from "./role/role.customer";
import { mineral_harvester } from "./role/role.mineral.harvester";
import { attacker } from "./role/role.attacker";
//exploit
import { exploit_attacker } from "./exploit/exploit_attack";
//扩张
import { claimer } from "./role/role.claimer";
import { outHarvester } from "./Temporary/outHarvester";
import { H_Cer } from "./Temporary/H_Cer";
//structure
import { tower } from "./structure/structure.tower";
//config
// import role_config from "./creeps.config.json";
import rooms_config from "./config/rooms.config.json";
var Resources = {
    "RESOURCE_KEANIUM": RESOURCE_KEANIUM
}
/**
 * @description 对象类型的配置 {w41s22:{roomName}}
 */
const rooms_config_Object = {};
for (const iterator of rooms_config.roomsData) {
    rooms_config_Object[iterator.roomName] = iterator;
}
//############################################################################
// Game.property.logMarketHistory = function () {
//     Game.market.outgoingTransactions()
// }
//############################################################################
//判断任务队列是否改变-第一个任务完成
Memory.targetTask = {};
//判断每个房间的carrier不存在且房间能量小于300
let noCarrierRooms = {};
for (const room in Game.rooms) {
    Memory.targetTask[room] = {};
    Memory.targetTask[room].carryTarget = "";
    Memory.targetTask[room].repairTarget = "";
    noCarrierRooms[room] = false;
}
//缓存的路径|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|
// let path = [];
// if (Game.rooms["W41S23"]) {
//     path = Game.rooms["W41S23"].findPath(new RoomPosition(35, 42, "W41S23"), new RoomPosition(23, 0, "W41S23"));
//     path = Room.serializePath(path);
// }
// Memory.W41S23_energyTotop = "3541111188888888888811111111111111181111211111";
//
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
 * @description 按房间规划spawn的孵化分配
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
 * @param {Object:{Number}} creepsRoomNum 单个房间的creep个数，判断creep个数是否改变了
 */
let creepsRoomNum = {
    'W41S22': 0,
    'W41S23': 0
}
/**
 * @param {Object} creepsAll 全局所有creep
 */
let creepsAll;
/**
 * @description 所有spawn按房间分
 * @param {Object:{Array}} spawnRoom
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
    creepsAll = Game.creeps;
    /**
     * @description 检索Memory删除没用的数据
     */
    for (const key in Memory.creeps) {
        if (!creepsAll[key]) {
            delete Memory.creeps[key];
        }
    }
    /**
     * @description 分配structure_tower任务
     */
    let structures = Game.structures;
    for (const key in structures) {
        let structure = structures[key];
        if (structure.structureType == STRUCTURE_TOWER) {
            tower.run(structure, 15);
        }
    }
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
                if (name.includes(iterator.roomName) && RegExp(`^${iterator.creeps[key].name}`).test(name)) {
                    obj[key] += 1;
                }
            }
        }
        numRoomCreep[iterator.roomName] = obj;
    }
    /**
     * @description 一個房間的creep數量,判断是否有creep的死亡/孵化
     * {"W41S22":3,"W41S23":2}
     */
    let numRoom = {};
    for (const room in numRoomCreep) {
        let num = 0;
        for (const name in numRoomCreep[room]) {
            num += numRoomCreep[room][name];
        }
        numRoom[room] = num;
    }
    //生成新creep完成时执行，分配targetIndex
    //creep死亡和新生后执行，给harvester分配index 
    for (const room in Game.rooms) {
        //判断是否有carrier
        //判断harvester是否担任运输任务
        if (numRoomCreep[room].Carrier == 0 && Game.rooms[room].energyAvailable <= 300) {
            noCarrierRooms[room] = true;
        }
        //判断一个房间的creep数量是否改变，改变后重新分配harvester的目标targetIndex
        if (numRoom[room] != creepsRoomNum[room]) {
            creepsRoomNum[room] = numRoom[room];
            let new_arr_harvester = f_roleArrayRoom('Harvester')[room];
            for (const index in arrRoom_harvester[room]) {
                new_arr_harvester[index].memory.targetIndex = index % 2;
            }
        }
    }
    /**
     * @description 孵化creep
     */
    // !孵化
    for (const room of rooms_config.roomsData) {
        //一个房间的配置
        let numCreep = numRoomCreep[room.roomName];
        for (const key in room.creeps) {
            //不同种类的creep配置
            let role = room.creeps[key];
            if (numCreep[key] < role.number) {
                //建造-房间有施工地时孵化
                if (Game.rooms[room.roomName].find(FIND_CONSTRUCTION_SITES).length > 0 && role.name == "builder") {
                    f_spawnCreep(room, role);
                }
                //采矿-矿有资源时孵化
                else if (role.name == "mineralharvester" && Game.rooms[room.roomName].find(FIND_MINERALS)[0].mineralAmount > 0 &&
                    Game.rooms[room.roomName].storage.store.getCapacity(Resources[room.resource]) < 400000) {
                    f_spawnCreep(room, role);
                }
                //外能量-有外房间时孵化
                //exploit-开拓房间/complate-以开拓房间
                else if (room.roomStyle == 'exploit' && role.name == "outharvester") {
                    f_spawnCreep(room, role);
                }
                //外房运输energy-有外房间时孵化
                else if (role.name == "hcer" && room.roomStyle == 'exploit') {
                    f_spawnCreep(room, role);
                }
                //控制从storage向terimal转移能量和矿物
                else if (role.name == "customer" && Game.rooms[room.roomName].storage.store.getUsedCapacity(RESOURCE_KEANIUM) > 10000) {
                    f_spawnCreep(room, role);
                }
                //除建筑/采矿/外能量/外能量运输
                else if (role.name != "builder" && role.name != "mineralharvester" && role.name != "outharvester" && role.name != 'hcer') {
                    f_spawnCreep(room, role);
                }
            }
        }
    }
    /**
     * @description 分配creep任务
     */
    for (const room in Game.rooms) {
        for (const key in Game.creeps) {
            //判断creep属于哪个room
            if (key.includes(room)) {
                let _creep = Game.creeps[key];
                //自身检查是否被攻击了并发出孵化attack指令
                // _creep.wasAttacked({ _creep, _room: room });

                switch (_creep.memory.role) {
                    case "Harvester":
                        {
                            harvester.run({ _creep, noCarrier: noCarrierRooms[room] });
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
                            repairer.run({ _creep, arr_repairer: arrRoom_repairer[room] });
                        }
                        break;
                    case "Carrier":
                        {
                            carrier.run({ _creep, arr_carrier: arrRoom_carrier[room] });
                        }
                        break;
                    case "MineralHarvester":
                        {
                            mineral_harvester.run({ _creep, _mineral: Game.rooms[room].find(FIND_MINERALS) });
                        }
                        break;
                    //自定义
                    case "Customer":
                        {
                            //不同房间匹配不同的资源
                            let __resource;
                            switch (room) {
                                case 'W41S22': {
                                    __resource = RESOURCE_KEANIUM;
                                };
                                    break;
                                case 'W41S23': {
                                    __resource = RESOURCE_OXYGEN;
                                };
                                    break;
                                default: ; break;
                            }
                            if (Game.rooms[room].terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 160000 && Game.rooms[room].storage.store.getUsedCapacity(RESOURCE_ENERGY) > 600000) {
                                customer.run({
                                    _creep,
                                    _target: _creep.room.terminal,
                                    _origin: _creep.room.storage,
                                    _method: "transfer",
                                    _resource: RESOURCE_ENERGY,
                                    //大于容量会停止widthdraw
                                    _amount: 100,
                                });
                            }
                            else if (Game.rooms[room].terminal.store.getUsedCapacity(__resource) < 200000 && Game.rooms[room].storage.store.getUsedCapacity(__resource) > 100000) {
                                customer.run({
                                    _creep,
                                    _target: _creep.room.terminal,
                                    _origin: _creep.room.storage,
                                    _method: "transfer",
                                    _resource: __resource,
                                    //大于容量会停止widthdraw
                                    _amount: 100,
                                });
                            }
                            else {
                                let storage = Game.rooms[room].storage;
                                let links = Game.rooms[room].lookForAtArea(LOOK_STRUCTURES, storage.pos.y - 2, storage.pos.x - 2, storage.pos.y + 2, storage.pos.x + 2, true)
                                    .filter((item) => item.structure.structureType == "link");
                                customer.run({
                                    _creep,
                                    _target: _creep.room.terminal,
                                    _origin: links[0].structure,
                                    _method: "transfer",
                                    _resource: RESOURCE_ENERGY,
                                    //大于容量会停止widthdraw
                                    _amount: 100,
                                });
                            };
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
                    case "E_Attacker": {
                        // console.log(JSON.stringify(rooms_config_Object[room].creeps.E_Attacker));
                        exploit_attacker.run({ _creep, _roomName: rooms_config_Object[room].creeps.E_Attacker.targetRoom })
                    }
                    //
                    default: ;
                        break;
                }
                //     //存活时间小于10显示气泡
                if (_creep.ticksToLive < 10) _creep.say(_creep.ticksToLive);
            }
        }
        //交易

    }
    //
    // Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE], 'Customer', { memory: { role: 'Customer' } });
    /**
     * @description 数据信息的获取
     */
    stateScanner();
    /**
     * @description 遍历房间控制交易
     */
    const resource = {
        RESOURCE_KEANIUM: RESOURCE_KEANIUM,
        RESOURCE_OXYGEN: RESOURCE_OXYGEN,
    }
    for (const room of rooms_config.roomsData) {
        //*判断相应房间的terminal的矿物储备
        if (Game.rooms[room.roomName].terminal.store.getUsedCapacity(resource[room.resource]) > 1000) {
            let market_list = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: resource[room.resource] }).sort((a, b) => {
                return b.price - a.price;
            });
            let market_order_list = [];
            for (const iterator of market_list) {
                if (iterator.price < 1) {
                    break;
                }
                if (iterator.amount != 0 && iterator.price > 1) {
                    let obj = {}
                    obj.id = iterator.id;
                    obj.amount = iterator.amount;
                    market_order_list.push(obj);
                }
            }
            if (market_order_list.length > 0) {
                if (Game.rooms[room.roomName].terminal.store.getUsedCapacity(resource[room.resource]) > 1000) {
                    Game.market.deal(market_order_list[0].id, market_order_list[0].amount, room.roomName);
                }
            }
        }
        //*判断能量储备
        else if (Game.rooms[room.roomName].terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 100000 &&
            Game.rooms[room.roomName].storage.store.getUsedCapacity(RESOURCE_ENERGY) > 300000) {
            let market_list = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY }).sort((a, b) => {
                return b.price - a.price;
            });
            let market_order_list = [];
            for (const iterator of market_list) {
                if (iterator.price < 10) {
                    break;
                }
                if (iterator.amount != 0 && iterator.price > 10) {
                    let obj = {}
                    obj.id = iterator.id;
                    obj.amount = iterator.amount;
                    market_order_list.push(obj);
                }
            }
            if (market_order_list.length > 0) {
                if (Game.rooms[room.roomName].terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
                    Game.market.deal(market_order_list[0].id, market_order_list[0].amount, room.roomName);
                }
            }
        }
    }
};

