
//拿取energy
export const withdraw = {
    /**
     * @description 拿取
     * @param {*} _creep 
     * @param {*} _container 
     * @param {Boolean} isStorage
     * @returns {Boolean}
     */
    run: function ({ _creep, _container, isStorage }) {

        //有energy的container建筑【arr】
        const containers = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType == STRUCTURE_CONTAINER && item.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        //掉落的energy【arr】
        const energy = _creep.room.find(FIND_DROPPED_RESOURCES);

        /**
         * @description 判断container有没有energy
         * @param {boolean} haveEnergy
         */
        let haveEnergy = false;//有energy为false
        //全都没有energy为true
        haveEnergy = containers.every(element => {
            return element.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
        })

        //判断工作状态
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
        } else if (_creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && haveEnergy) {//自己身上有container没有能量
            return true;
            //container都没energ而自身有一些nergy
        }

        //
        if (!_creep.memory.working) {

            //拿取掉落的energy
            // if (energy.length > 0) {
            //     if (_creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
            //         _creep.moveTo(energy[0])
            //     }
            // }

            //拿取container的energy
            if (!haveEnergy) {
                if (_creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers[0], {
                        visualizePathStyle: {
                            stroke: "#ffffff",
                            opacity: 1
                        }
                    });
                }
            }

            //拿取storage的energy(运输目标是storage时不执行)
            else if (!isStorage) {

                //storage
                const storage = _creep.room.find(FIND_STRUCTURES, {
                    filter: item => item.structureType == STRUCTURE_STORAGE
                });

                if (_creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(storage[0], {
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