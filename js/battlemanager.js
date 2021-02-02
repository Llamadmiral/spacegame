function battleSpeedComparator(a, b) {
    return a.speed - b.speed;
}

class BattleParticipant {
    constructor(participant, battleLogic, speed) {
        this.participant = participant;
        this.battleLogic = battleLogic;
        this.speed = speed;
        this.isPlayer = false;
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
            GameManager.instance.combatOrderIndicator.init(this);
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
        }
    }

    hasPlayer() {
        let has = false;
        for (let i = 0; i < this.participants.length; i++) {
            if (this.participants[i].isPlayer) {
                has = true;
                break;
            }
        }
        return has;
    }

    start() {
        this.participants.sort(battleSpeedComparator);
        GameManager.instance.combatOrderIndicator.init(this);
        this.started = true;
        this.next();
    }

    next() {
        if (this.participants.length === 1) {
            console.log('Battle ended!');
            GameManager.instance.combatOrderIndicator.close();
            GameManager.instance.player.leaveBattle();
            this.index = 0;
            this.started = false;
        } else {
            GameManager.instance.cameraTarget = this.participants[this.index].participant;
            this.participants[this.index].performRound();
            this.index = (this.index + 1) % this.participants.length;
        }
    }

}