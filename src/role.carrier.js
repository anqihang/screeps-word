import { withdraw } from "./withdraw";
import { assignTarget } from "./assignTarget";

export const carrier = {
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
                    })
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
                    })
                }
            }
        }
    }
}

