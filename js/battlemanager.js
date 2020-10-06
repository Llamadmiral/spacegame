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
    }

    start() {
        this.participants.sort(battleSpeedComparator);
        GameManager.combatOrderIndicator.init(this);
        this.next();
    }

    next() {
        console.log('called', this.participants[this.index]);
        GameManager.cameraTarget = this.participants[this.index].participant;
        console.log(GameManager.cameraTarget);
        this.participants[this.index].performRound();
        this.index = (this.index + 1) % this.participants.length;
    }

}