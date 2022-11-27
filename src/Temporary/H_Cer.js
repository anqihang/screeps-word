//新房间挖能量运输能量
import { harvest } from "../harvest";

export const H_Cer = {
    /**
     * @description 新房间采集、运输energy
     * @param {Object} _creep creep对象
     * @param {object} _room  room对象
     */
    run: function ({ _creep, _room }) {
        let structure_energy = Game.rooms['W41S23'].find(FIND_STRUCTURES, {
            filter: item => {
                return (item.structureType == STRUCTURE_TOWER || item.structureType == STRUCTURE_SPAWN) && item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (harvest.run({ _creep, _target: _room.find(FIND_SOURCES_ACTIVE) })) {
            if (_creep.transfer(structure_energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(structure_energy[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff',
                        opacity: .3
                    }
                })
            }
        }
    }
}