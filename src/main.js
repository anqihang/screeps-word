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
    Memory.stats.rclPrgress = Game.rooms['W41S22'].controller.progress / Game.rooms['W41S22'].controller.progressTotal;

}
//##################################################################################

//role
import { harvester } from './role.harvester';
import { builder } from './role.builder';
import { upgrader } from './role.upgrader';
import { repairer } from './role.repairer';
import { carrier } from './role.carrier';
import { customer } from './role.customer';
import { mineral_harvester } from './role.mineral.harvester';
import { attacker } from './role/role.attacker';
//扩张
import { claimer } from './role.claimer';
import { outHarvester } from './Temporary/outHarvester';
//structure
import { tower } from './structure.tower';
//config
import role_config from './creeps.config.json';
//############################################################################
// Game.property.logMarketHistory = function () {
//     Game.market.outgoingTransactions()
// }
//############################################################################
Memory.carryTarget = "";
Memory.repairTarget = "";

//缓存的路径
let path = [];
if (Game.rooms['W41S23']) {
    path = Game.rooms['W41S23'].findPath(new RoomPosition(35, 42, 'W41S23'), new RoomPosition(23, 0, 'W41S23'));
    path = Room.serializePath(path);
}
Memory.W41S23_energyTotop = '3541111188888888888811111111111111181111211111';
//
//W41S22房间的矿
let mineral_k = Game.rooms['W41S22'].find(FIND_MINERALS);

/**
 * 将字符串变为变量
 * @param {Object} obj 转变的字符串对象数组
 * @param {String} str 转变的字符串
 * @returns 
 */
function getVerb(obj, str) {
    let arr = str.split('.');
    while (arr.length) {
        obj = obj[arr.shift()];
    }
    return obj;
}

//将身体部件字符串转化为变量
function tov(str) {
    let r = [];
    for (const iterator of str) {
        switch (iterator) {
            case "WORK": r.push(WORK); break;
            case "CARRY": r.push(CARRY); break;
            case "MOVE": r.push(MOVE); break;
            case "ATTACK": r.push(ATTACK); break;
            case "RANGED_ATTACK": r.push(RANGED_ATTACK); break;
            case "HEAL": r.push(HEAL); break;
            case "CLAIM": r.push(CLAIM); break;
            case "TOUGH": r.push(TOUGH); break;
        }
    }
    return r;
}

//原型方法-------------------------------------------------------
//原型-切换目标对象(self-role对象数组)
Creep.prototype.switchTarget = function (self) {
    if (self.memory.targetIndex == 0) {
        self.memory.targetIndex += 1;
    } else if (self.memory.targetIndex == 1) {
        self.memory.targetIndex -= 1;
    }
    // console.log(1, self, self.memory.targetIndex);
}
//creep的被攻击发送生成attack方法
Creep.prototype.wasAttacked = function ({ _creep }) {
    if (_creep.hits < _creep.hitsMax) {
        attacker.run({ _creep });
    }
}
//判断是否creep个数改变了
let creepsL;

//loop主函数----------------------------------------------------------------
export const loop = function () {
    //兑换pielx
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    let creeps = Game.creeps;
    let structures = Game.structures;
    //是否控制多个房间
    let moreRoom = Object.keys(Game.rooms).length > 1 ? true : false;
    //检索Memory删除没用的数据
    for (const key in Memory.creeps) {
        if (!creeps[key]) {
            delete Memory.creeps[key]
        }
    }
    //分配structure任务
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
    let arr_harvester = roleArray('Harvester');
    let arr_builder = roleArray('Builder');
    let arr_upgrader = roleArray('Upgrader');
    let arr_repairer = roleArray('Repairer');
    let arr_carrier = roleArray('Carrier');

    //统计不同种类creep的名字数组(用于数量计算)【arr】
    function filter(role) {
        return Object.keys(creeps).filter(item => {
            return creeps[item].memory.role == role;
        })
    }
    //增加role需要添加
    let num_harvester = filter('Harvester');
    let num_builder = filter('Builder');
    let num_upgrader = filter('Upgrader');
    let num_repairer = filter('Repairer');
    let num_carrier = filter('Carrier');
    let num_customer = filter('Customer');
    let num_mineralharvester = filter('MineralHarvester');
    let num_outharvester = filter('OutHarvester');
    let num = {
        num_harvester, num_builder, num_upgrader, num_repairer,
        num_carrier, num_customer, num_mineralharvester, num_outharvester
    };
    //所有房间的施工地
    // let structure_site = [];
    // if (moreRoom) {
    //     structure_site = Game.rooms['W41S23'].find(FIND_CONSTRUCTION_SITES);
    // }
    let structure_site_all = [];
    for (const key in Game.rooms) {
        structure_site_all.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES))
    }

    //生成新creep完成时
    if (Object.keys(creeps).length != creepsL) {
        creepsL = Object.keys(creeps).length;
        //生成新的harvester时给所有harester分配index
        // if (role.name == 'carrier') {
        //获取最新的harvester对象数组
        let new_arr_harvester = roleArray('Harvester');
        //给harvester分配targetIndex
        for (const index in arr_harvester) {
            new_arr_harvester[index].memory.targetIndex = index % 2;
        }
        // }
    }
    //根据config生成新creep
    for (const key in role_config) {
        let role = role_config[key];
        if (getVerb(num, `num_${role.name}`).length < role.number) {
            let index = Math.floor(Math.random() * 10);
            if (role.name != 'builder' && role.name != 'mineralharvester' && role.name != 'outharvester') {
                Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });

            } else if (structure_site_all.length > 0 && role.name == 'builder') {
                Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
            } else if (role.name == 'mineralharvester' && mineral_k[0].mineralAmount > 0) {
                Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
            } else if (moreRoom && role.name == 'outharvester') {
                Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
            }
        }
    }
    // }
    //生成creep的旧代码
    //#region
    // if (num_harvester.length < 3) {
    //     let name = Math.floor(Math.random() * 4);
    //     Game.spawns['Spawn0'].spawnCreep([WORK, CARRY, MOVE], `harvester${name}`, { memory: { role: 'Harvester' } });
    // }
    // if (num_carrier.length < 1) {
    //     let name = Math.floor(Math.random() * 4);
    //     Game.spawns['Spawn0'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], `carrier${name}`, { memory: { role: 'Carrier' } });
    // }
    // //判断是否有施工工地需要生成builder
    // if (structre_site.length) {
    //     if (num_builder.length < 2) {
    //         let name = Math.floor(Math.random() * 4);
    //         Game.spawns['Spawn0'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], `builder${name}`, { memory: { role: 'Builder' } });
    //     }
    // }
    // //
    // if (num_repairer.length < 1) {
    //     let name = Math.floor(Math.random() * 4);
    //     Game.spawns['Spawn0'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE], `repairer${name}`, { memory: { role: 'Repairer' } });
    // }
    // if (num_upgrader.length < 3) {
    //     let name = Math.floor(Math.random() * 4);
    //     Game.spawns['Spawn0'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], `upgrader${name}`, { memory: { role: 'Upgrader' } });
    // }
    //#endregion
    //判断harvester是否担任运输任务
    let noCarrier = false;
    if (num_carrier.length == 0 && Game.spawns['Spawn0'].room.energyAvailable <= 300) {
        noCarrier = true;
    }

    //分配creep任务
    for (const key in creeps) {
        let _creep = creeps[key];
        //自身检查是否被攻击了并发出孵化attack指令
        _creep.wasAttacked({ _creep });

        //
        switch (_creep.memory.role) {
            case 'Harvester': {
                harvester.run({ _creep, noCarrier });
            }; break;
            case 'Builder': {
                builder.run(_creep);
            }; break
            case 'Upgrader': {
                upgrader.run(_creep);
            }; break
            case 'Repairer': {
                repairer.run({ _creep, arr_repairer });
            }; break;
            case 'Carrier': {
                carrier.run({ _creep, arr_carrier });
            }; break;
            case 'Customer': {
                customer.run({
                    _creep,
                    _target: _creep.room.terminal,
                    _origin: _creep.room.storage,
                    _method: 'transfer',
                    _resource: RESOURCE_KEANIUM,
                    //大于容量会停止widthdraw
                    _amount: 100
                });
            }; break;
            case 'MineralHarvester': {
                mineral_harvester.run({ _creep, _mineral: mineral_k });
            }; break;
            case 'Claimer': {
                claimer.run({ _creep });
            }; break;
            case 'OutHarvester': {
                if (moreRoom) {
                    outHarvester.run({ _creep, _room: Game.rooms['W41S23'] });
                }
            }; break;


            default:
                break;
        }
        if (_creep.ticksToLive < 10)
            _creep.say(_creep.ticksToLive);
        //
        //#region
        // if (_creep.memory.role == 'Harvester') {
        //     harvester.run({ _creep, noCarrier });
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Builder') {
        //     builder.run(_creep);
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Upgrader') {
        //     upgrader.run(_creep);
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Repairer') {
        //     repairer.run({ _creep, arr_repairer });
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Carrier') {
        //     carrier.run({ _creep, arr_carrier });
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Customer') {
        //     customer.run({ _creep, _target: _creep.room.controller, _origin: _creep.room.storage, _method: 'upgradeController' });

        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'MineralHarvester') {
        //     mineral_harvester.run({ _creep, _mineral: mineral_k });
        //     if (_creep.ticksToLive < 100)
        //         _creep.say(_creep.ticksToLive);
        // }
        // if (_creep.memory.role == 'Claimer') {
        //     claimer.run({ _creep });
        // }
        // if (moreRoom) {
        //     if (_creep.memory.role == 'OutHarvester') {
        //         outHarvester.run({ _creep, _room: Game.rooms['W41S23'] });
        //     }
        // }
        //#endregion
    }
    // Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE], 'Customer', { memory: { role: 'Customer' } });
    stateScanner();
}