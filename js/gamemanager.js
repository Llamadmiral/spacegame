class GameManager {
    constructor() {
        if (!!GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;

        this.player = null;
        this.cameraTarget = null;

        return this;
    }
}