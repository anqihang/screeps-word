import { harvest } from "./harvest";


export const harvester = {
    /**
     * @description 采集者
     * @param {*} _creep 
     * @param {Boolean} noCarrier 没有carrier了
     */
    run: function ({ _creep, noCarrier }) {

        //需要energy的建筑物【arr】，并按照已有energy的递增排序---没有container时替换targets
        const structure_energy = _creep.room.find(FIND_STRUCTURES, {
            filter: item => {
                return (item.structureType == STRUCTURE_EXTENSION ||
                    item.structureType == STRUCTURE_SPAWN ||
                    item.structureType == STRUCTURE_TOWER) &&
                    item.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }).sort((a, b) => a.store.getCapacity(RESOURCE_ENERGY) - b.store.getCapacity(RESOURCE_ENERGY));
        //----------------------------------//
        // 需要energy的container建筑【arr】
        let targets = _creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        //----------------------------------//
        //指定位置范围内的container【arr】
        const containers = _creep.room.lookAtArea(23, 30, 24, 32, true).filter(item => {
            return item.type == 'structure'
        });
        //
        try {
            const tar = containers.filter(item => {
                return item.structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            })
        } catch (error) {
            // console.log(error.message);
        }
        //没有carrier后harvester开始运输
        if (noCarrier) {
            targets = structure_energy;
        }
        //所有energy矿【arr】
        const source_energy = _creep.room.find(FIND_SOURCES);
        //
        if (harvest.run({ _creep, _target: source_energy })) {
            if (_creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                _creep.moveTo(targets[0], { visualizePahStyle: { stroke: '#fae16b', opacity: .6 } });
            }
        }
    }
}
// module.exports = harvester;
// tar[0].structure

// [
//     {
//         "type": "structure",
//         "structure": {
//             "id": "634ef405f1b4e3800b8a5808",
//             "room": {
//                 "name": "W41S22", "energyAvailable": 550,
//                 "energyCapacityAvailable": 550,
//                 "visual": { "roomName": "W41S22" }
//             },
//             "pos": { "x": 30, "y": 24, "roomName": "W41S22" },
//             "store": { "energy": 151 },
//             "storeCapacity": 2000,
//             "ticksToDecay": 205,
//             "hits": 154700,
//             "hitsMax": 250000,
//             "structureType": "container"
//         },
//         "x": 30, "y": 24
//     }
// ]
