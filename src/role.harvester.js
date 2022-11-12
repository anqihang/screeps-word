import { harvest } from "./harvest";


export const harvester = {
    /**
     * @description 采集者
     * @param {*} _creep 
     * @param {Array} _container 交互的container (必填)
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
        //--- 存放energy的container建筑【arr】
        let targets = _creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        //
        let source = _creep.room.find(FIND_SOURCES);
        let cons = [];
        for (const item of source) {
            cons.push(_creep.room.lookForAtArea(LOOK_STRUCTURES, item.pos.y - 2, item.pos.x - 2, item.pos.y + 2, item.pos.x + 2, true).filter(item => item.structure.structureType == 'container')[0])
        }
        //------------------------
        // //获取指定位置的container(存储energy)
        // let container = _creep.room.lookForAt(LOOK_STRUCTURES, 29, 23).filter(item => {
        //     return item.structureType == 'container';
        // })
        //----------------------------------//
        targets = _container;
        //没有carrier后harvester开始运输
        if (noCarrier) {
            targets = structure_energy;
        }
        //所有energy矿【arr】
        const source_energy = _creep.room.find(FIND_SOURCES);
        //
        if (harvest.run({ _creep, _target: source_energy })) {
            if (_creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(targets[0], { visualizePahStyle: { stroke: '#fae16b', opacity: .6 } });
            }
        }
    }
}
