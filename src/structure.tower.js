//tower
export const tower = {
    /**
     * 
     * @param {*} _structure 
     * @param {Number} _range 
     */
    run: function (_structure, _range) {
        if (_structure.store.getCapacity(RESOURCE_ENERGY) > 0) {
            //敌人
            const targets_attack = _structure.room.find(FIND_HOSTILE_CREEPS);
            //需要治疗的creep
            const targets_heal = _structure.pos.findInRange(FIND_CREEPS, _range, {
                filter: item => {
                    return item.body.hits < item.body.hitsMax;
                }
            });
            //修复的建筑（不包含wall)
            const targets_repair = _structure.pos.findInRange(FIND_STRUCTURES, _range, {
                filter: item => {
                    return item.hits < item.hitsMax && item.structureType != STRUCTURE_WALL && item.structureType == STRUCTURE_CONTAINER;
                }
            }).sort((a, b) => a.hits - b.hits);
            //工作模式选择
            if (targets_attack.length > 0) {
                _structure.attack(targets_attack[0]);
                // Game.notify('你被攻击了', 0);
            }
            //else if (targets_heal.length) {
            //     _structure.heal(targets_heal[0]);
            // }
            else if (targets_repair.length) {
                if (_structure.store.getFreeCapacity(RESOURCE_ENERGY) < 100) {
                    _structure.repair(targets_repair[0]);
                }
            }
        }
    }
}