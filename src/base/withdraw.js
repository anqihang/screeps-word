
//拿取energy
export const withdraw = {
    /**
     * @description 拿取
     * @param {*} _creep 
     * @param {*} _container 拿取energy的目标对象 (选填)
     * @param {Boolean} isStorage 是否是去storage拿能量 (选填)
     * @param {*} _resource 拿取的resource种类
     * @param {*} _amount 拿取的resource数量
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
         * @param {Array} containers_mineral
         */
        let containers_mineral = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType == STRUCTURE_CONTAINER && (item.store.getUsedCapacity(RESOURCE_KEANIUM) > 300 || item.store.getUsedCapacity(RESOURCE_OXYGEN) > 300);
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
            return element.store.getUsedCapacity(RESOURCE_KEANIUM) == 0 && element.store.getUsedCapacity(RESOURCE_OXYGEN) == 0;
        });
        // console.log(noMineral);

        //判断工作状态
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
        } else if ((_creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && noEnergy) || ((_creep.store.getUsedCapacity(RESOURCE_KEANIUM) > 0 || _creep.store.getUsedCapacity(RESOURCE_OXYGEN) > 0) && noMineral)) {//自己身上有container没有能量
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

            //container没energy后有k拿取k
            if (!noMineral && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_mineral[0], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_mineral[0], {
                        visualizePathStyle: {
                            stroke: "#906efa",
                            opacity: .3
                        }
                    })
                }
                //container没energy后有O拿取O
                else if (_creep.withdraw(containers_mineral[0], RESOURCE_OXYGEN) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_mineral[0], {
                        visualizePathStyle: {
                            stroke: "#906efa",
                            opacity: .3
                        }
                    })
                }
            }
            //container有energy时拿取container的energy//10.31只有carrier能在container拿取
            else if (!noEnergy && _creep.memory.role == 'Carrier' && _creep.store.getFreeCapacity() > 0) {
                if (_creep.withdraw(containers_energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(containers_energy[0], {
                        visualizePathStyle: {
                            stroke: "#ffffff",
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
}