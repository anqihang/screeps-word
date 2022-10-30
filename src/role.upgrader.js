import { harvest } from './harvest';
export const upgrader = {
    run: function (_creep) {
        if (harvest.run(_creep, 1)) {
            if (_creep.upgradeController(_creep.room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_creep.room.controller);
            }
        }
    }
}

// module.exports = upgrader;