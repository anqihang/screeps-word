import { harvest } from "./harvest";

export const harvester = {
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
