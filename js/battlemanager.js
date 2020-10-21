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

    removeParticipant(participant) {
        let indexToRemove = -1;
        for (let i = 0; i < this.participants.length; i++) {
            if (this.participants[i].participant === participant) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove > -1) {
            this.participants.splice(indexToRemove, 1);
        } else {
            console.log('Unable to find participant', participant);
        }
    }

    start() {
        this.participants.sort(battleSpeedComparator);
        GameManager.combatOrderIndicator.init(this);
        this.started = true;
        this.next();
    }

    next() {
        if (this.participants.length === 1) {
            console.log('Battle ended!');
            GameManager.combatOrderIndicator.close();
            GameManager.player.leaveBattle();
            this.index = 0;
            this.started = false;
        } else {
            GameManager.cameraTarget = this.participants[this.index].participant;
            this.participants[this.index].performRound();
            this.index = (this.index + 1) % this.participants.length;
        }
    }

}