
//任务目标的分配，保证在完成前不会切换目标对象
export const assignTarget = {
    /**
     * @description 给不同的creep分配不同的目标对象
     * @param {Array} targets structure_energy不working时的目标
     * @param {Object} roleTarget  Memory.carryTarget目标index
     * @param {Array} roleArr 相应的creep对象数组
     */
    run: function ({ room, roleTarget, roleArr, targets }) {
        //判断目标任务是否完成一个
        // if (Memory[roleTarget] != targets[0].id) {
        //     Memory[roleTarget] = targets[0].id;
        if (Memory.targetTask[room][roleTarget] != targets[0].id) {
            Memory.targetTask[room][roleTarget] = targets[0].id;
            // 只剩一个任务时
            if (targets.length == 1) {
                // _creep.memory.targetIndex = 0;
                roleArr.forEach(element => {
                    element.memory.targetIndex = 1;
                });
            } else {
                // if (_creep == roleArr[1])
                //任务超过一个后重新分配
                if (roleArr.length > 1) {
                    if (roleArr[0].memory.targetIndex == roleArr[1].memory.targetIndex) {
                        roleArr[0].memory.targetIndex = 0;
                        roleArr[1].memory.targetIndex = 1;
                    }
                }
            }
            //任务完成后切换下标保证不会改变原来的目标
            for (const iterator of roleArr) {
                iterator.switchTarget(iterator);
            }
        }
    }
}