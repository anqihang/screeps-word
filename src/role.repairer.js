import { withdraw } from './withdraw';
import { assignTarget } from './assignTarget';

export const repairer = {
    run: function ({ _creep, arr_repairer }) {
        if (withdraw.run({ _creep })) {

            /**
             *  @description 需要修复的建筑物(不包含wall)并按照hits递增排序
             */
            let targets = _creep.room.find(FIND_STRUCTURES, {
                filter: object => {
                    return object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL;
                }
            });
            //没有targets后修复wall
            if (targets.length == 0) {
                targets = _creep.room.find(FIND_STRUCTURES, {
                    filter: item => {
                        return item.hits < item.hitsMax && item.structureType == STRUCTURE_WALL;
                    }
                });
            }
            //按照hits递增排序
            targets.sort((a, b) => a.hits - b.hits);
            //按照距离远近排序
            targets.sort((a, b) => {
                return Math.sqrt((a.pos.x - _creep.pos.x) ** 2 + (a.pos.y - _creep.pos.y) ** 2) -
                    Math.sqrt((b.pos.x - _creep.pos.x) ** 2 + (b.pos.y - _creep.pos.y) ** 2)
            })
            if (targets.length > 0) {

                // const creeps = Game.spawns['Spawn0'].room.find(FIND_CREEPS).filter(item => {
                //     return item.memory.role == 'Repairer';
                // });

                //分配目标对象
                assignTarget.run({ roleTarget: 'repairTarget', roleArr: arr_repairer, targets: targets });

                //if()
                if (_creep.repair(targets[_creep.memory.targetIndex]) == ERR_NOT_IN_RANGE) {
                    _creep.moveTo(targets[_creep.memory.targetIndex], {
                        visualizePathStyle: {
                            stroke: '#ac4b1e',
                            opacity: .6
                        }
                    });
                }
            }
        }
    }
}
// module.exports = repairer;