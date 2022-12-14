# screeps

## 模块功能

### main:主文件

> - 角色（role)

    - role.harvester  采集单位
    - role.builder    建造单位
    - role.upgeader   升级单位
    - role.repairer   维修单位(消耗1修复40)
    - role.carrier    运输单位
    - role.attacker   战斗单位

> - 基础工作(base work)

    - harvest   采集
    - withdraw  拿取

> - 配置文件(config.json)

    - creeps
        # number 数量
        # body   部件
        # memory 定义字段

    - rooms

> - 建筑(structure)

    - structure_tower

> - 功能

    - assignTarget为同类每个creep分配不同的目标

## 颜色标志

> - 线路

     - 红色：攻击状态<br/>
     - 绿色：建造状态<br/>
     - 蓝色：运输状态<br/>
     - 橘色：修复状态<br/>
     - 黄色：采集状态<br/>

## Memory

    - stats 收集的可视化信息
    - targetTask 任务队列的第一个任务，判断是否完成第一个任务目标
