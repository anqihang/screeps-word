import { withdraw } from '../base/withdraw';

export const customer = {
    /** 
     * @description 自定义creep
     * @param {*} param0 
     */
    run: function ({ _creep, _target, _origin, _method, _resource, _amount }) {
        if (withdraw.run({ _creep, _container: _origin, _resource, _amount })) {
            for (const resourceType in _creep.carry) {
                if (_creep[_method](_target, resourceType) == ERR_NOT_IN_RANGE) {
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
}