import { harvest } from './harvest';
export const upgrader = {
    run: function (_creep) {
        //所有energy矿【arr】
        const source_energy = _creep.room.find(FIND_SOURCES);
        if (harvest.run({ _creep, energy_index: 1, _target: source_energy })) {
            if (_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_creep.room.controller);
            }
        }
    }
}

// module.exports = upgrader;