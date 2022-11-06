import { harvest } from "./harvest";

export const mineral_harvester = {
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
}