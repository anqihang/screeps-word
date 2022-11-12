export const attacker = {
    run: function ({ _creep }) {
        let enemies = _creep.room.find(FIND_HOSTILE_CREEPS);
        if (!Game.creeps.attack) {
            Game.spawns['Spawn0'].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], 'attack');
        }
        if (Game.creeps.attack.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
            Game.creeps.attack.moveTo(enemies[0]);
        }
    }
}