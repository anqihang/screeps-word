//新房间采能量升级controller--外矿（能量）的开采
import { harvest } from "../harvest";
export const outHarvester = {
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
                let road_repair = _creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: item => item.structureType == STRUCTURE_ROAD && item.hits < item.hitsMax
                });
                if (road_repair) {
                    _creep.repair(road_repair[0]);
                }
            }
        }
    }
}