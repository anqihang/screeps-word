'use strict';

const harvest = {

    /** 
     * @param {Object} _creep (必填)
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
     * @param {Object} _creep
     * @param {Object} _container 交互的container (選填)
     * @param {Boolean} noCarrier 没有carrier了 (选填)
     */
    run: function ({ _creep, noCarrier, _container }) {
        //需要energy的建筑物【arr】，并按照已有energy的递增排序---没有container时替换targets
        const structure_energy = _creep.room.find(FIND_STRUCTURES, {
            filter: (item) => {
                return (
                    (item.structureType == STRUCTURE_EXTENSION || item.structureType == STRUCTURE_SPAWN || item.structureType == STRUCTURE_TOWER) &&
                    item.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        }).sort((a, b) => a.store.getCapacity(RESOURCE_ENERGY) - b.store.getCapacity(RESOURCE_ENERGY));

        //所有energy矿【arr】
        const source_energy = _creep.room.find(FIND_SOURCES);
        //creep的targetIndex
        let targetIndex = _creep.memory.targetIndex;
        //所采集的矿对象
        let o_energy = source_energy[targetIndex];
        //所采集的矿的附近的container
        let container_energy = _creep.room
            .lookForAtArea(LOOK_STRUCTURES, o_energy.pos.y - 2, o_energy.pos.x - 2, o_energy.pos.y + 2, o_energy.pos.x + 2, true)
            .filter((item) => item.structure.structureType == "container");
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
                _creep.moveTo(target, { visualizePahStyle: { stroke: "#fae16b", opacity: 0.6 } });
            }
        }
    },
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
            //container没有energy后拿取storage的energy(运输目标是storage时不执行，自定义resource时不执行)
            //
            else if (!isStorage && !_resource) {
                //storage
                // let storage = _creep.room.find(FIND_STRUCTURES, {
                //     filter: item => item.structureType == STRUCTURE_STORAGE
                // })[0];
                let storage = _creep.room.storage;
                // storage = Game.rooms['W41S22'].storage;
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
        if (_creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {

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
        } else {
            if (harvest.run({ _creep, _target: Game.rooms['W41S23'].find(FIND_SOURCES_ACTIVE) })) {
                // console.log(_cree);
                let construction = [];
                for (const key in Game.rooms) {
                    construction.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES));
                }
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


    }
};
// module.exports = builder;

//升级controller

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

//任务目标的分配，保证在完成前不会切换目标对象
const assignTarget = {
    /**
     * @description 给不同的creep分配不同的目标对象
     * @param {Array} targets structure_energy不working时的目标
     * @param {Object} roleTarget  Memory.carryTarget目标index
     * @param {Array} roleArr 相应的creep对象数组
     */
    run: function ({ room, roleTarget, roleArr, targets }) {
        //判断目标任务是否完成一个
        // if (Memory[roleTarget] != targets[0].id) {
        //     Memory[roleTarget] = targets[0].id;
        if (Memory.targetTask[room][roleTarget] != targets[0].id) {
            Memory.targetTask[room][roleTarget] = targets[0].id;
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

                //分配目标对象
                assignTarget.run({ room: _creep.room.name, roleTarget: 'repairTarget', roleArr: arr_repairer, targets: targets });

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
        assignTarget.run({ room: _creep.room.name, roleTarget: 'carryTarget', roleArr: arr_carrier, targets: structure_energy });

        //if()
        if (withdraw.run({ _creep, isStorage })) {
            //携带有k就传送k到storage
            if (_creep.store.getUsedCapacity(RESOURCE_KEANIUM) > 0) {
                //根据creep自身的targetIndex选择目标
                if (_creep.transfer(storage[_creep.memory.targetIndex], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(storage[_creep.memory.targetIndex], {
                        visualizePathStyle: {
                            stroke: '#11a8cd',
                            opacity: .6
                        }
                    });
                }
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

//新房间采能量升级controller--外矿（能量）的开采
const outHarvester = {
    run: function ({ _creep, _room }) {
        if (harvest.run({ _creep, _target: _room.find(FIND_SOURCES_ACTIVE) })) {
            // if (_creep.transfer(Game.rooms['W41S22'].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     // _creep.moveTo(Game.rooms['W41S22'].storage, {
            //     //     visualPathStyle: {
            //     //         stroke: '#fbe679',
            //     //         opacity: .3
            //     //     }
            //     // });
            //     if (_creep.room.name == 'W41S23') {
            //         _creep.moveByPath(Memory.W41S23_energyTotop);
            //     } else {
            //         _creep.moveTo(Game.rooms['W41S22'].storage, {
            //             visualPathStyle: {
            //                 stroke: '#fbe679',
            //                 opacity: .3
            //             }
            //         });
            //     }
            //     //行动时修复道路
            //     let road_repair = _creep.pos.findInRange(FIND_STRUCTURES, 3, {
            //         filter: item => item.structureType == STRUCTURE_ROAD && item.hits < item.hitsMax
            //     });
            //     if (road_repair) {
            //         _creep.repair(road_repair[0]);
            //     }
            // }
            //
            if (_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_creep.room.controller, {
                    visualPathStyle: {
                        stroke: '#fbe679',
                        opacity: .3
                    }
                });
                //移动的时候维修道路
                let road_repair = _creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: item => (item.structureType == STRUCTURE_ROAD || item.structureType == STRUCTURE_CONTAINER) && item.hits < item.hitsMax
                });
                if (road_repair) {
                    _creep.repair(road_repair[0]);
                }
            }
        }
    }
};

//新房间挖能量运输能量

const H_Cer = {
    /**
     * @description 新房间采集、运输energy
     * @param {Object} _creep creep对象
     * @param {object} _room  room对象
     */
    run: function ({ _creep, _room }) {
        let structure_energy = Game.rooms['W41S23'].find(FIND_STRUCTURES, {
            filter: item => {
                return (item.structureType == STRUCTURE_TOWER ||
                    item.structureType == STRUCTURE_SPAWN ||
                    item.structureType == STRUCTURE_EXTENSION
                    || item.structureType == STRUCTURE_STORAGE
                ) && item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (harvest.run({ _creep, _target: _room.find(FIND_SOURCES_ACTIVE) })) {
            if (_creep.transfer(structure_energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(structure_energy[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff',
                        opacity: .3
                    }
                });
            }
            //移动的时候维修道路
            let road_repair = _creep.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: item => (item.structureType == STRUCTURE_ROAD || item.structureType == STRUCTURE_CONTAINER) && item.hits < item.hitsMax
            });
            if (road_repair) {
                _creep.repair(road_repair[0]);
            }
        }
    }
};

//tower
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
	number: 6,
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
		role: "OutHarvester"
	}
};
var HCer = {
	name: "hcer",
	number: 1,
	body: [
		"WORK",
		"WORK",
		"CARRY",
		"CARRY",
		"CARRY",
		"MOVE",
		"MOVE"
	],
	memory: {
		role: "HCer"
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
	OutHarvester: OutHarvester,
	HCer: HCer
};

var fileName = "rooms_config";
var roomsData = [
	{
		roomName: "W41S22",
		roomStyle: "complate",
		roomLevel: 7,
		creepnum: 0,
		creeps: {
			Harvester: {
				name: "harvester",
				number: 0,
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
			},
			Carrier: {
				name: "carrier",
				number: 0,
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
			},
			Builder: {
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
			},
			Repairer: {
				name: "repairer",
				number: 0,
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
			},
			Customer: {
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
			},
			MineralHarvester: {
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
			},
			Upgrader: {
				name: "upgrader",
				number: 0,
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
			}
		}
	},
	{
		roomName: "W41S23",
		roomStyle: "complate",
		roomLevel: 7,
		creepnum: 0,
		creeps: {
			Harvester: {
				name: "harvester",
				number: 0,
				body: [
					"WORK",
					"CARRY",
					"MOVE"
				],
				memory: {
					role: "Harvester",
					targetIndex: 0
				}
			},
			Carrier: {
				name: "carrier",
				number: 1,
				body: [
					"CARRY",
					"CARRY",
					"MOVE"
				],
				memory: {
					role: "Carrier",
					targetIndex: 0
				}
			},
			Builder: {
				name: "builder",
				number: 0,
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
			},
			Upgrader: {
				name: "upgrader",
				number: 0,
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
			},
			Repairer: {
				name: "repairer",
				number: 0,
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
			},
			Customer: {
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
			},
			MineralHarvester: {
				name: "mineralharvester",
				number: 0,
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
			}
		}
	}
];
var rooms_config = {
	fileName: fileName,
	roomsData: roomsData
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
    Memory.stats.rclPrgress = Game.rooms["W41S22"].controller.progress / Game.rooms["W41S22"].controller.progressTotal;
};
//############################################################################
// Game.property.logMarketHistory = function () {
//     Game.market.outgoingTransactions()
// }
//############################################################################
//判断任务队列是否改变-第一个任务完成
// Memory.carryTarget = "";
// Memory.repairTarget = "";
//
Memory.targetTask = {};
for (const room in Game.rooms) {
    Memory.targetTask[room] = {};
    Memory.targetTask[room].carryTarget = "";
    Memory.targetTask[room].repairTarget = "";
}
//缓存的路径|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|/\|\/|
// let path = [];
// if (Game.rooms["W41S23"]) {
//     path = Game.rooms["W41S23"].findPath(new RoomPosition(35, 42, "W41S23"), new RoomPosition(23, 0, "W41S23"));
//     path = Room.serializePath(path);
// }
// Memory.W41S23_energyTotop = "3541111188888888888811111111111111181111211111";
//
//W41S22房间的矿
Game.rooms["W41S22"].find(FIND_MINERALS);

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
/**
 * @param {Object} creepsAll 全局所有creep
 */
// let creepsAll = Game.creeps; //+++++
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
const loop = function () {
    //兑换pielx
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    //
    let creeps = Game.creeps;
    let structures = Game.structures;
    //
    let creepsAll = Game.creeps; //+++++

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

    roleArray("Repairer");
    roleArray("Carrier");
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
    f_roleArrayRoom("Harvester");
    f_roleArrayRoom("Builder");
    f_roleArrayRoom("Upgrader");
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
                if (name.includes(iterator.roomName) && RegExp(`^${iterator.creeps[key].name}`).test(name)) {
                    obj[key] += 1;
                }
            }
        }
        numRoomCreep[iterator.roomName] = obj;
    }
    for (const room in numRoomCreep) {
        let num = 0;
        for (const name in numRoomCreep[room]) {
            num += numRoomCreep[room][name];
        }
    }
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
    // for (const room in Game.rooms) {
    //     if (numRoom[room] != creepsRoomNum[room]) {
    //         creepsRoomNum[room] = numRoom[room];
    //         let new_arr_harvester = f_roleArrayRoom('Harvester')[room];
    //         for (const index in arrRoom_harvester[room]) {
    //             new_arr_harvester[index].memory.targetIndex = index % 2;
    //         }
    //     }
    // }
    //
    //根据config生成新creep
    for (const key in role_config) {
        let role = role_config[key];
        if (getVerb(num, `num_${role.name}`).length < role.number) {
            let index = Math.floor(Math.random() * 10);
            //建造-有施工地时孵化
            // if (structure_site_all.length > 0 && role.name == "builder") {
            //     Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            // }
            //采矿-矿有资源时孵化
            // else
            // if (role.name == "mineralharvester" && mineral_k[0].mineralAmount > 0) {
            //     Game.spawns["Spawn0"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            // }
            //外能量-有外房间时孵化
            // else
            if (moreRoom && role.name == "outharvester") {
                Game.spawns["Spawn_W41S22_1"].spawnCreep(f_tov(role.body), `${role.name}_W41S23_${index}`, { memory: role.memory });
            }
            //外房运输energy-有外房间时孵化
            else if (role.name == "hcer" && moreRoom) {
                Game.spawns["Spawn_W41S23"].spawnCreep(f_tov(role.body), `${role.name}_W41S23_${index}`, { memory: role.memory });
            }
            //除建筑/采矿/外能量
            else if (role.name != "builder" && role.name != "mineralharvester" && role.name != "outharvester") {
                Game.spawns["Spawn_W41S22_1"].spawnCreep(f_tov(role.body), `${role.name}_W41S22_${index}`, { memory: role.memory });
            }
        }
    }
    /**
     * @description 孵化creep
     */
    for (const room of rooms_config.roomsData) {
        //一个房间的配置
        let numCreep = numRoomCreep[room.roomName];
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
                // else if (role.name == "hcer" && moreRoom) {
                //     f_spawnCreep(room, role);
                // }
                //除建筑/采矿/外能量
                else if (role.name != "builder" && role.name != "mineralharvester" && role.name != "outharvester") {
                    f_spawnCreep(room, role);
                }
            }
        }
    }
    //判断harvester是否担任运输任务
    let noCarrier = false;
    if (num_carrier.length == 0 && Game.spawns["Spawn0"].room.energyAvailable <= 300) {
        noCarrier = true;
    }

    //分配creep任务
    for (const room in Game.rooms) {
        for (const key in Game.creeps) {
            if (key.includes(room)) {
                let _creep = Game.creeps[key];
                //自身检查是否被攻击了并发出孵化attack指令
                _creep.wasAttacked({ _creep });

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
                }
                //     //存活时间小于10显示气泡
                if (_creep.ticksToLive < 10) _creep.say(_creep.ticksToLive);

            }
        }
    }
    //
    // Game.spawns['Spawn0'].spawnCreep([WORK,CARRY,MOVE], 'Customer', { memory: { role: 'Customer' } });
    stateScanner();
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
