class GameManager {
    constructor() {
        if (!!GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;

        this.player = null;
        this.cameraTarget = null;
        this.combatOrderIndicator = null;
        this.actionBar = null;
        this.monsterManager = null;
        this.battle = null;

        return this;
    }
}