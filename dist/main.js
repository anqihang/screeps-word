'use strict';

const harvest = {

    /** 
     * @param {*} _creep (必填)
     * @param {Number} energy_index energy矿的序号 (选填)
     * @param {Array} _target energy矿或mineral矿数组 (必填)
     * @returns {Boolean}
    */
    // harvesting: true,
    run: function ({ _creep, energy_index = 0, _target }) {
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
            //从工作状态到不工作状态
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
            //从不工作状态到工作状态
        }

        if (!_creep.memory.working) {
            if (_creep.harvest(_target[energy_index]) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_target[energy_index], { visualizePahStyle: { stroke: '#fae16b', opacity: 1 } });
            }
            return false;
        } else {
            return true;
        }
    }

};

const harvester = {
    /**
     * @description 采集者
     * @param {*} _creep 
     * @param {Object} _container 交互的container (必填)
     * @param {Boolean} noCarrier 没有carrier了 (选填)
     */
    run: function ({ _creep, noCarrier, _container }) {

        //需要energy的建筑物【arr】，并按照已有energy的递增排序---没有container时替换targets
        const structure_energy = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return (item.structureType == STRUCTURE_EXTENSION ||
                    item.structureType == STRUCTURE_SPAWN ||
                    item.structureType == STRUCTURE_TOWER) &&
                    item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }).sort((a, b) => a.store.getCapacity(RESOURCE_ENERGY) - b.store.getCapacity(RESOURCE_ENERGY));
        //----------------------------------//

        //所有energy矿【arr】
        const source_energy = _creep.room.find(FIND_SOURCES);
        //creep的targetIndex
        let targetIndex = _creep.memory.targetIndex;
        //所采集的矿对象
        let o_energy = source_energy[targetIndex];
        //所采集的矿的附近的container
        let container_energy = _creep.room.lookForAtArea(LOOK_STRUCTURES, o_energy.pos.y - 2, o_energy.pos.x - 2, o_energy.pos.y + 2, o_energy.pos.x + 2, true).filter(item => item.structure.structureType == 'container');
        let target = container_energy[0].structure;
        //外部指定container
        if (_container) {
            target = _container;
        }
        //没有carrier后harvester开始运输
        if (noCarrier) {
            target = structure_energy[0];
        }

        //----------------------//
        if (harvest.run({ _creep, _target: source_energy, energy_index: _creep.memory.targetIndex })) {
            if (_creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(target, { visualizePahStyle: { stroke: '#fae16b', opacity: .6 } });
            }
        }
    }
};

//拿取energy
const withdraw = {
    /**
     * @description 拿取
     * @param {*} _creep 
     * @param {*} _container 拿取energy的对象 (选填)
     * @param {Boolean} isStorage 是否是去storage拿能量 (选填)
     * @param {*} _resource 拿取的resource种类
     * @param {*} _resource 拿取的resource数量
     * @returns {Boolean}
     */
    run: function ({ _creep, _container, _resource, _amount, isStorage }) {
        /**
         * @description 有energy的container建筑【arr】
         * @param {Array} container_energy
         */
        let containers_energy = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType == STRUCTURE_CONTAINER && item.store.getUsedCapacity(RESOURCE_ENERGY) > 300;
            }
        });
        /**
         * @description 有k矿的container建筑【arr】
         * @param {Array} container_mineral
         */
        let containers_mineral = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType == STRUCTURE_CONTAINER && item.store.getUsedCapacity(RESOURCE_KEANIUM) > 300;
            }
        });

        //掉落的energy【arr】
        // const energy = _creep.room.find(FIND_DROPPED_RESOURCES);

        /**
         * @description  
         * @param {boolean} noEnergy 判断container有没有energy,都没有为true
         */
        let noEnergy = false;//有energy为false
        let noMineral = false;

        noEnergy = containers_energy.every(element => {
            return element.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
        });
        //全都没有矿物为true
        noMineral = containers_mineral.every(element => {
            return element.store.getUsedCapacity(RESOURCE_KEANIUM) == 0;
        });

        //判断工作状态
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
        } else if ((_creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && noEnergy) || (_creep.store.getUsedCapacity(RESOURCE_KEANIUM) > 0 && noMineral)) {//自己身上有container没有能量
            return true;
            //container都空了而自身携带有一些
        }

        //if()
        if (!_creep.memory.working) {
            //customer//自定义拿取的目标
            if (_container && _resource) {
                if (_creep.withdraw(_container, _resource, _amount) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(_container, {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: 1
                        }
                    });
                }
            }
            //拿取掉落的energy
            //#region
            // if (energy.length > 0) {
            //     if (_creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
            //         _creep.moveTo(energy[0])
            //     }
            // }
            //#endregion

            //container有energy时拿取container的energy//10.31只有carrier能在container拿取
            if (!noEnergy && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_energy[0], {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: .3
                        }
                    });
                }
            }
            //container没energy后有k拿取k
            else if (!noMineral && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_mineral[0], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_mineral[0], {
                        visualizePathStyle: {
                            stroke: "#906efa",
                            opacity: .3
                        }
                    });
                }
            }

            //container没有energy后拿取storage的energy(运输目标是storage时不执行)
            //
            else if (!isStorage) {

                //storage
                let storage = _creep.room.find(FIND_STRUCTURES, {
                    filter: item => item.structureType == STRUCTURE_STORAGE
                });
                storage = Game.rooms['W41S22'].storage;
                if (_creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(storage, {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: .6
                        }
                    });
                }
            }

            return false;
        } else {
            return true;
        }
    }
};

// const harvester = require('role.harvester');
const builder = {
    /**
     * @description 建造者
     * @param {*} _creep 
     */
    run: function (_creep) {
        if (withdraw.run({ _creep })) {
            /**
             * @description 施工工地并按照所需energy的多少递增排序
             */
            // let construction = _creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            //所有房间的施工地
            let construction = [];
            for (const key in Game.rooms) {
                construction.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES));
            }
            // console.log(construction.length);
            // construction = Game.rooms['W41S23'].find(FIND_CONSTRUCTION_SITES);
            // construction.sort((a, b) => a.progressTotal - b.progressTotal);
            if (construction.length) {
                if (_creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(construction[0], {
                        visualizePathStyle: {
                            stroke: "#23d08a",
                            opacity: .6
                        }
                    });
                }
            }
        }
    }
};
// module.exports = builder;

const upgrader = {
    run: function (_creep) {
        //所有energy矿【arr】
        _creep.room.find(FIND_SOURCES);
        // if (harvest.run({ _creep, energy_index: 1, _target: source_energy })) {
        //     if (_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         _creep.moveTo(_creep.room.controller);
        //     }
        // }
        if (withdraw.run({ _creep, _container: _creep.room.storage, _resource: RESOURCE_ENERGY })) {
            if (_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_creep.room.controller);
            }
        }
    }
};

// module.exports = upgrader;

const assignTarget = {
    /**
     * @description 给不同的creep分配不同的目标对象
     * @param {Array} targets structure_energy不working时的目标
     * @param {Object} roleTarget  Memory.carryTarget目标index
     * @param {Array} roleArr 相应的creep对象数组
     */
    run: function ({ roleTarget, roleArr, targets }) {

        //判断目标任务是否完成一个
        if (Memory[roleTarget] != targets[0].id) {
            Memory[roleTarget] = targets[0].id;
            // 只剩一个任务时
            if (targets.length == 1) {
                // _creep.memory.targetIndex = 0;
                roleArr.forEach(element => {
                    element.memory.targetIndex = 1;
                });
            } else {
                // if (_creep == roleArr[1])
                //任务超过一个后重新分配
                if (roleArr.length > 1) {
                    if (roleArr[0].memory.targetIndex == roleArr[1].memory.targetIndex) {
                        roleArr[0].memory.targetIndex = 0;
                        roleArr[1].memory.targetIndex = 1;
                    }
                }
            }
            //任务完成后切换下标保证不会改变原来的目标
            for (const iterator of roleArr) {
                iterator.switchTarget(iterator);
            }
        }
    }
};

const repairer = {
    run: function ({ _creep, arr_repairer }) {
        if (withdraw.run({ _creep })) {

            /**
             *  @description 需要修复的建筑物(不包含wall)并按照hits递增排序
             */
            let targets = _creep.room.find(FIND_STRUCTURES, {
                filter: object => {
                    return object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL;
                }
            });
            if (targets.length != 0) {
                //按照hits递增排序
                targets.sort((a, b) => a.hits - b.hits);
                //按照距离远近排序
                targets.sort((a, b) => {
                    return Math.sqrt((a.pos.x - _creep.pos.x) ** 2 + (a.pos.y - _creep.pos.y) ** 2) -
                        Math.sqrt((b.pos.x - _creep.pos.x) ** 2 + (b.pos.y - _creep.pos.y) ** 2)
                });
            }
            //没有targets后修复wall
            if (targets.length == 0) {
                targets = _creep.room.find(FIND_STRUCTURES, {
                    filter: item => {
                        return item.hits < item.hitsMax && item.structureType == STRUCTURE_WALL;
                    }
                });
                targets.sort((a, b) => a.hits - b.hits);
            }

            //
            if (targets.length > 0) {

                // const creeps = Game.spawns['Spawn0'].room.find(FIND_CREEPS).filter(item => {
                //     return item.memory.role == 'Repairer';
                // });

                //分配目标对象
                assignTarget.run({ roleTarget: 'repairTarget', roleArr: arr_repairer, targets: targets });

                //if()
                if (_creep.repair(targets[_creep.memory.targetIndex]) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(targets[_creep.memory.targetIndex], {
                        visualizePathStyle: {
                            stroke: '#ac4b1e',
                            opacity: .3
                        }
                    });
                }
            }
        }
    }
};
// module.exports = repairer;

const carrier = {
    /**
     * @description 运输者
     * @param {*} _creep 
     * @param {Array} arr_carrier carrier角色的creep对象数组
     */
    run: function ({ _creep, arr_carrier }) {

        //运输的目标是否是storage
        let isStorage = false;

        /**
         * @description 需要energy的structure并按照已有的energy量递增排序
         * @param {Array} structure_energy
         */
        let structure_energy = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return (item.structureType == STRUCTURE_EXTENSION ||
                    item.structureType == STRUCTURE_SPAWN ||
                    item.structureType == STRUCTURE_TOWER) &&
                    item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }).sort((a, b) => a.store.getCapacity(RESOURCE_ENERGY) - b.store.getCapacity(RESOURCE_ENERGY));


        //creep所在的房间的storage
        let storage = _creep.room.find(FIND_STRUCTURES, {
            filter: item => item.structureType == STRUCTURE_STORAGE
        });
        // storage(建筑不需要资源后向storage运输resource)
        if (structure_energy.length == 0) {
            structure_energy = _creep.room.find(FIND_STRUCTURES, {
                filter: item => item.structureType == STRUCTURE_STORAGE
            });
            isStorage = true;
        }
        //切换targetIndex，保证任务完成时不会改变其他creep的任务目标
        assignTarget.run({ roleTarget: 'carryTarget', roleArr: arr_carrier, targets: structure_energy });

        //#region
        //判断目标任务是否完成一个
        // if (Memory.carryTarget != structure_energy[0].id) {
        //     Memory.carryTarget = structure_energy[0].id;
        //     // 只剩一个任务时
        //     if (structure_energy.length == 1) {
        //         // _creep.memory.targetIndex = 0;
        //         arr_carrier.forEach(element => {
        //             element.memory.targetIndex = 1;
        //         });
        //     } else {
        //         // if (_creep == arr_carrier[1])
        //         //任务超过一个后重新分配
        //         if (arr_carrier[0].memory.targetIndex == arr_carrier[1].memory.targetIndex) {
        //             arr_carrier[0].memory.targetIndex = 0;
        //             arr_carrier[1].memory.targetIndex = 1;
        //         }
        //     }
        //     //任务完成后切换下标保证不会改变原来的目标
        //     for (const iterator of arr_carrier) {
        //         iterator.switchTarget(iterator);
        //     }
        // }
        //#endregion

        //if()
        if (withdraw.run({ _creep, isStorage })) {
            //携带有k就传送k到storage
            if (_creep.store.getUsedCapacity(RESOURCE_KEANIUM) > 0) {
                // for (const resourceType in _creep.carry) {
                if (_creep.transfer(storage[_creep.memory.targetIndex], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(storage[_creep.memory.targetIndex], {
                        visualizePathStyle: {
                            stroke: '#11a8cd',
                            opacity: .6
                        }
                    });
                }
                // }
            }
            //传送energy到需要的structure
            else {
                if (_creep.transfer(structure_energy[_creep.memory.targetIndex], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(structure_energy[_creep.memory.targetIndex], {
                        visualizePathStyle: {
                            stroke: '#11a8cd',
                            opacity: .6
                        }
                    });//根据距离排序
                    structure_energy.sort((a, b) => {
                        return Math.sqrt((a.pos.x - _creep.pos.x) ** 2 + (a.pos.y - _creep.pos.y) ** 2) -
                            Math.sqrt((b.pos.x - _creep.pos.x) ** 2 + (b.pos.y - _creep.pos.y) ** 2)
                    });
                }
            }

        }

    }
};

const customer = {
    /** 
     * @description 自定义creep
     * @param {*} param0 
     */
    run: function ({ _creep, _target, _origin, _method, _resource, _amount }) {
        if (withdraw.run({ _creep, _container: _origin, _resource, _amount })) {
            for (const resourceType in _creep.carry) {
                if (_creep[_method](_target, resourceType) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(_target, {
                        visualizePathStyle: {
                            stroke: "#000000",
                            opacity: 1
                        }
                    });
                }
            }
        }
    }
};

const mineral_harvester = {
    /**
     * @_creep
     * @param  {Array} _mineral 矿对象(可选)
     * @param {Array} _container 存储矿的container(可选)
     * @param {*} param0 
     */
    run: function ({ _creep, _mineral, _container }) {

        //存放mineral的container
        let container_k = _creep.room.lookForAt(LOOK_STRUCTURES, 39, 25).filter(item => {
            return item.structureType == 'container';
        });
        // let containers = _creep.room.find(FIND_STRUCTURES, {
        //     filter: item => {
        //         return item.structureType == STRUCTURE_CONTAINER
        //     }
        // })
        //获取mineral
        let mineral;
        if (!_mineral) {
            mineral = _creep.room.find(FIND_MINERALS);
        }
        if (harvest.run({ _creep, _target: (_mineral || mineral) })) {
            if (_creep.transfer(container_k[0], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(container_k[0], { visualizePahStyle: { stroke: '#fae16b', opacity: .6 } });
            }
        }
    }
};

const attacker = {
    run: function ({ _creep }) {
        let enemies = _creep.room.find(FIND_HOSTILE_CREEPS);
        if (!Game.creeps.attack) {
            Game.spawns['Spawn0'].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], 'attack');
        }
        if (Game.creeps.attack.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
            Game.creeps.attack.moveTo(enemies[0]);
        }
    }
};

const claimer = {
    run: function ({ _creep }) {
        // const creep = Game.creeps['claimer'];
        //要占领的房间
        const room = Game.rooms['W41S23'];
        //如果不存在就前往房间
        if (!room) {
            _creep.moveTo(new RoomPosition(25, 25, 'W41S23'));
        } else {
            //已经进入新房间
            if (_creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(room.controller, {
                    visualizePathStyle: {
                        stroke: '#b99cfb',
                        opacity: 1
                    }
                });
            }
        }
    }
};

const outHarvester = {
    run: function ({ _creep, _room }) {
        if (harvest.run({ _creep, _target: _room.find(FIND_SOURCES_ACTIVE) })) {
            if (_creep.transfer(Game.rooms['W41S22'].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // _creep.moveTo(Game.rooms['W41S22'].storage, {
                //     visualPathStyle: {
                //         stroke: '#fbe679',
                //         opacity: .3
                //     }
                // });
                if (_creep.room.name == 'W41S23') {
                    _creep.moveByPath(Memory.W41S23_energyTotop);
                } else {
                    _creep.moveTo(Game.rooms['W41S22'].storage, {
                        visualPathStyle: {
                            stroke: '#fbe679',
                            opacity: .3
                        }
                    });
                }
                let road_repair = _creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: item => item.structureType == STRUCTURE_ROAD && item.hits < item.hitsMax
                });
                if (road_repair) {
                    _creep.repair(road_repair[0]);
                }
            }
        }
    }
};

const tower = {
    /**
     * 
     * @param {*} _structure 
     * @param {Number} _range 
     */
    run: function (_structure, _range) {
        if (_structure.store.getCapacity(RESOURCE_ENERGY) > 0) {
            //敌人
            const targets_attack = _structure.room.find(FIND_HOSTILE_CREEPS);
            //需要治疗的creep
            _structure.pos.findInRange(FIND_CREEPS, _range, {
                filter: item => {
                    return item.body.hits < item.body.hitsMax;
                }
            });
            //修复的建筑（不包含wall)
            const targets_repair = _structure.pos.findInRange(FIND_STRUCTURES, _range, {
                filter: item => {
                    return item.hits < item.hitsMax && item.structureType != STRUCTURE_WALL && item.structureType == STRUCTURE_CONTAINER;
                }
            }).sort((a, b) => a.hits - b.hits);
            //工作模式选择
            if (targets_attack.length > 0) {
                _structure.attack(targets_attack[0]);
                // Game.notify('你被攻击了', 0);
            }
            //else if (targets_heal.length) {
            //     _structure.heal(targets_heal[0]);
            // }
            else if (targets_repair.length) {
                if (_structure.store.getFreeCapacity(RESOURCE_ENERGY) < 100) {
                    _structure.repair(targets_repair[0]);
                }
            }
        }
    }
};

var Harvester = {
	name: "harvester",
	number: 2,
	body: [
		"WORK",
		"WORK",
		"WORK",
		"WORK",
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Harvester",
		targetIndex: 0
	}
};
var Carrier = {
	name: "carrier",
	number: 2,
	body: [
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Carrier",
		targetIndex: 0
	}
};
var Builder = {
	name: "builder",
	number: 2,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Builder"
	}
};
var Upgrader = {
	name: "upgrader",
	number: 8,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Upgrader"
	}
};
var Repairer = {
	name: "repairer",
	number: 2,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Repairer",
		targetIndex: "0"
	}
};
var Customer = {
	name: "customer",
	number: 0,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "Customer"
	},
	target: "_creep.room.controller",
	origin: "_creep.room.storage",
	method: "transfer",
	resource: "RESOURCE_ENERGY",
	amount: 100
};
var MineralHarvester = {
	name: "mineralharvester",
	number: 1,
	body: [
		"WORK",
		"WORK",
		"WORK",
		"CARRY",
		"MOVE"
	],
	memory: {
		role: "MineralHarvester"
	}
};
var OutHarvester = {
	name: "outharvester",
	number: 1,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "OutHarvester"
	}
};
var role_config = {
	Harvester: Harvester,
	Carrier: Carrier,
	Builder: Builder,
	Upgrader: Upgrader,
	Repairer: Repairer,
	Customer: Customer,
	MineralHarvester: MineralHarvester,
	OutHarvester: OutHarvester
};

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

};
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
};
//creep的被攻击发送生成attack方法
Creep.prototype.wasAttacked = function ({ _creep }) {
    if (_creep.hits < _creep.hitsMax) {
        attacker.run({ _creep });
    }
};
//判断是否creep个数改变了
let creepsL;

//loop主函数----------------------------------------------------------------
const loop = function () {
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
            delete Memory.creeps[key];
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
    roleArray('Builder');
    roleArray('Upgrader');
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
        structure_site_all.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES));
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
            } break;
            case 'Builder': {
                builder.run(_creep);
            } break
            case 'Upgrader': {
                upgrader.run(_creep);
            } break
            case 'Repairer': {
                repairer.run({ _creep, arr_repairer });
            } break;
            case 'Carrier': {
                carrier.run({ _creep, arr_carrier });
            } break;
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
            } break;
            case 'MineralHarvester': {
                mineral_harvester.run({ _creep, _mineral: mineral_k });
            } break;
            case 'Claimer': {
                claimer.run({ _creep });
            } break;
            case 'OutHarvester': {
                if (moreRoom) {
                    outHarvester.run({ _creep, _room: Game.rooms['W41S23'] });
                }
            } break;
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
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
