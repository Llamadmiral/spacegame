function battleSpeedComparator(a, b) {
    return a.speed - b.speed;
}

class BattleParticipant {
    constructor(participant, battleLogic, speed) {
        this.participant = participant;
        this.battleLogic = battleLogic;
        this.speed = speed;
    }

    performRound() {
        this.battleLogic.call(this.participant);
    }
}

class Battle {
    constructor() {
        this.participants = [];
        this.index = 0;
        this.started = false;
    }

    addParticipant(participant) {
        this.participants.push(participant);
        if (this.started) {
            this.participants.sort(battleSpeedComparator);
            GameManager.combatOrderIndicator.init(this);
        }
    }

    start() {
        this.participants.sort(battleSpeedComparator);
        GameManager.combatOrderIndicator.init(this);
        this.started = true;
        this.next();
    }

    next() {
        GameManager.cameraTarget = this.participants[this.index].participant;
        this.participants[this.index].performRound();
        this.index = (this.index + 1) % this.participants.length;
    }

}