// const harvester = require('role.harvester');
import { harvest } from './harvest';
import { withdraw } from './withdraw';
export const builder = {
    /**
     * @description 建造者
     * @param {*} _creep 
     */
    run: function (_creep) {
        // if (withdraw.run({ _creep })) {
        //     /**
        //      * @description 施工工地并按照所需energy的多少递增排序
        //      */
        //     // let construction = _creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        //     //所有房间的施工地
        //     let construction = [];
        //     for (const key in Game.rooms) {
        //         construction.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES))
        //     }
        //     // console.log(construction.length);
        //     // construction = Game.rooms['W41S23'].find(FIND_CONSTRUCTION_SITES);
        //     // construction.sort((a, b) => a.progressTotal - b.progressTotal);
        //     if (construction.length) {
        //         if (_creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
        //             _creep.moveTo(construction[0], {
        //                 visualizePathStyle: {
        //                     stroke: "#23d08a",
        //                     opacity: .6
        //                 }
        //             });
        //         }
        //     }
        // }
        //@@@@@@@@@
        if (harvest.run({ _creep, _target: Game.rooms['W41S23'].find(FIND_SOURCES_ACTIVE) })) {

            let construction = [];
            for (const key in Game.rooms) {
                construction.push(...Game.rooms[key].find(FIND_CONSTRUCTION_SITES))
            }
            // console.log(construction.length);
            // construction = Game.rooms['W41S23'].find(FIND_CONSTRUCTION_SITES);
            // construction.sort((a, b) => a.progressTotal - b.progressTotal);
            if (construction.length) {
                if (_creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(construction[0], {
                        visualizePathStyle: {
                            stroke: "#23d08a",
                            opacity: .6
                        }
                    });
                }
            }
        }
    }
}
// module.exports = builder;