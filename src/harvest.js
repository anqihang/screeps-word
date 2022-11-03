export const harvest = {

    /** 
     * @param {*} _creep (必填)
     * @param {Number} energy_index energy矿的序号 (选填)
     * @param {Array} _target energy矿数组 (必填)
     * @returns {Boolean}
    */
    // harvesting: true,
    run: function ({ _creep, energy_index = 0, _target }) {
        if (_creep.memory.working && _creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = false;
            //从工作状态到不工作状态
        } else if (!_creep.memory.working && _creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            _creep.memory.working = true;
            //从不工作状态到工作状态
        }



        if (!_creep.memory.working) {
            if (_creep.harvest(_target[energy_index]) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_target[energy_index], { visualizePahStyle: { stroke: '#fae16b', opacity: 1 } });
            }
            return false;
        } else {
            return true;
        }
    }

}