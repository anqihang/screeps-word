
//role
import { harvester } from './role.harvester';
import { builder } from './role.builder';
import { upgrader } from './role.upgrader';
import { repairer } from './role.repairer';
import { carrier } from './role.carrier';
import { customer } from './role.customer';
import { mineral_harvester } from './role.mineral.harvester';
import { attacker } from './role/role.attacker';
//占领
import { claimer } from './role.claimer';
import { outHarvester } from './Temporary/outHarvester';
//structure
import { tower } from './structure.tower';
//config
import role_config from './creeps.config.json';

Memory.carryTarget = "";
Memory.repairTarget = "";
//所有房间的energy矿
// for (const key in Game.rooms) {
//     let sources = Game.rooms[key].find(FIND_SOURCES);

// }
//存储energy的contaienr
let container_energy = Game.rooms['W41S22'].lookForAt(LOOK_STRUCTURES, 29, 23).filter(item => {
    return item.structureType == 'container';
})
//缓存的路径
let path = Game.rooms['W41S23'].findPath(new RoomPosition(35, 42, 'W41S23'), new RoomPosition(23, 0, 'W41S23'));
path = Room.serializePath(path);
Memory.W41S23_energyTotop = '3541111188888888888811111111111111181111211111';
//
//W41S22房间的矿
let mineral_k = Game.rooms['W41S22'].find(FIND_MINERALS);

/**
     * 将字符串变为变量
     * @param {Object} obj 
     * @param {String} str 
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

let creepsL;

//loop主函数----------------------------------------------------------------
export const loop = function () {
    //兑换pielx
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    let creeps = Game.creeps;
    let structures = Game.structures;
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
    //施工地
    const structure_site = Game.rooms['W41S23'].find(FIND_CONSTRUCTION_SITES);
    // let structure_site_all = Game.constructionSites;
    // console.log(JSON.stringify(structure_site_all));
    //根据config生成creep
    if (Object.keys(creeps).length != creepsL) {
        creepsL = Object.keys(creeps).length;
        for (const key in role_config) {
            let role = role_config[key];
            if (getVerb(num, `num_${role.name}`).length < role.number) {
                let index = Math.floor(Math.random() * 4);
                if (role.name != 'builder' && role.name != 'mineralharvester') {
                    Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
                    //生成新的harvester时给所有harester分配index
                    if (role.name == 'carrier') {
                        for (const index in arr_harvester) {
                            arr_harvester[index].memory.harvestIndex = index % 2;
                        }
                    }
                } else if (structure_site.length > 0 && role.name == 'builder') {
                    Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
                } else if (role.name == 'mineralharvester' && mineral_k[0].mineralAmount > 0) {
                    Game.spawns['Spawn0'].spawnCreep(tov(role.body), `${role.name}${index}`, { memory: role.memory });
                }
            }
        }
    }
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

    //获取carrier对象数组--
    // let carrierArrary = [];
    // for (const key in creeps) {
    //     if (creeps[key].memory.role == 'Carrier') {
    //         carrierArrary.push(creeps[key]);
    //     }
    // }



    //分配creep任务
    for (const key in creeps) {
        let _creep = creeps[key];
        _creep.wasAttacked({ _creep });
        if (_creep.memory.role == 'Harvester') {
            harvester.run({ _creep, noCarrier, _container: container_energy });
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Builder') {
            builder.run(_creep);
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Upgrader') {
            upgrader.run(_creep);
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Repairer') {
            repairer.run({ _creep, arr_repairer });
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Carrier') {
            carrier.run({ _creep, arr_carrier });
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Customer') {
            customer.run({ _creep, _target: _creep.room.controller, _origin: _creep.room.storage, _method: 'upgradeController' });

            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'MineralHarvester') {
            mineral_harvester.run({ _creep, _mineral: mineral_k });
            if (_creep.ticksToLive < 100)
                _creep.say(_creep.ticksToLive);
        }
        if (_creep.memory.role == 'Claimer') {
            claimer.run({ _creep });
        }
        if (_creep.memory.role == 'OutHarvester') {
            outHarvester.run({ _creep, _room: Game.rooms['W41S23'] });
        }
    }
    // Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE], 'Customer', { memory: { role: 'Customer' } });

    // console.log(Game.rooms['W41S23']);

}