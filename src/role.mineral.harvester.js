import { harvest } from "./harvest";

export const mineral_harvester = {
    /**
     * @_creep
     * @param  {Array} _mineral (可选)
     * @param {Array} _container (可选)
     * @param {*} param0 
     */
    run: function ({ _creep, _mineral, _container }) {
        //指定位置范围内的container【arr】
        // let containers = _creep.room.lookAtArea(22, 39, 25, 41, true).filter(item => {
        //     return item.type == 'structure'
        // });
        // containers = containers.filter(item => {
        //     return item.structure.structureType == 'container'
        // })
        // console.log((containers));
        let containers = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return item.structureType == STRUCTURE_CONTAINER
                // &&
                // item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        })
        //获取mineral
        const mineral = _creep.room.find(FIND_MINERALS);
        if (harvest.run({ _creep, _target: (_mineral || mineral) })) {
            if (_creep.transfer(containers[1], RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(containers[1], { visualizePahStyle: { stroke: '#fae16b', opacity: .6 } });
            }
        }
    }
}