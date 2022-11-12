
//拿取energy
export const withdraw = {
    /**
     * @description 拿取
     * @param {*} _creep 
     * @param {*} _container 拿取energy的对象 (选填)
     * @param {Boolean} isStorage 是否是去storage拿能量 (选填)
     * @returns {Boolean}
     */
    run: function ({ _creep, _container, isStorage }) {
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
                return item.structureType == STRUCTURE_CONTAINER && item.store.getUsedCapacity(RESOURCE_KEANIUM) > 0;
            }
        });

        //掉落的energy【arr】
        // const energy = _creep.room.find(FIND_DROPPED_RESOURCES);

        /**
         * @description 判断container有没有energy,都没有为true
         * @param {boolean} haveEnergy
         */
        let haveEnergy = false;//有energy为false
        let haveMineral = false;
        haveEnergy = containers_energy.every(element => {
            return element.store.getUsedCapacity(RESOURCE_ENERGY) == 0;//---
        })
        //全都没有矿物为true
        haveMineral = containers_mineral.every(element => {
            return element.store.getUsedCapacity(RESOURCE_KEANIUM) == 0;
        })

        //判断工作状态
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
        } else if ((_creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && haveEnergy) || (_creep.store.getUsedCapacity(RESOURCE_KEANIUM) > 0 && haveMineral)) {//自己身上有container没有能量
            return true;
            //container都没energ而自身有一些energy
        }

        //if()
        if (!_creep.memory.working) {
            //customer
            if (_container) {
                if (_creep.withdraw(_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(_container, {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: 1
                        }
                    })
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
            if (!haveEnergy && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_energy[0], {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: 1
                        }
                    });
                }
            }
            //container没energy后有k拿取k
            else if (!haveMineral && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_mineral[0], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_mineral[0], {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: 1
                        }
                    })
                }
            }

            //container没有energy后拿取storage的energy(运输目标是storage时不执行)

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
                            opacity: 1
                        }
                    });
                }
            }

            return false;
        } else {
            return true;
        }
    }
}