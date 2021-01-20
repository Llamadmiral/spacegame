class GameManager {
    constructor() {
        if (!!GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;
        this.player = null;
        this.playerTransporter = null;
        this.cameraTarget = null;
        this.combatOrderIndicator = null;
        this.actionBar = null;
        this.monsterManager = null;
        this.levelManager = null;
        this.battle = new Battle();

        return this;
    }
}