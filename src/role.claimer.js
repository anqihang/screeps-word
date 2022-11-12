export const claimer = {
    run: function ({ _creep }) {
        // const creep = Game.creeps['claimer'];
        //要占领的房间
        const room = Game.rooms['W41S23'];
        //如果不存在就前往房间
        if (!room) {
            _creep.moveTo(new RoomPosition(25, 25, 'W41S23'))
        } else {
            //已经进入新房间
            if (_creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(room.controller, {
                    visualizePathStyle: {
                        stroke: '#b99cfb',
                        opacity: .8
                    }
                })
            }
        }
    }
}