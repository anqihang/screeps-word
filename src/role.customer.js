import { withdraw } from './withdraw';

export const customer = {
    /**
     * 
     * @param {*} param0 
     */
    run: function ({ _creep, _target, _origin, _method }) {
        if (withdraw.run({ _creep, _container: _origin })) {
            if (_creep[_method](_target) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(_target, {
                    visualizePathStyle: {
                        stroke: "#000000",
                        opacity: 1
                    }
                })
            }
        }
    }
}