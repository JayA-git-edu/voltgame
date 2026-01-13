export class StateMachine {
  constructor(initialState, states) {
    this.state = initialState;
    this.states = states;
    this.stateData = {};
  }

  transition(nextState, data = {}) {
    if (!this.states[nextState]) return;
    if (this.states[this.state]?.exit) {
      this.states[this.state].exit(this, this.stateData);
    }
    this.state = nextState;
    this.stateData = data;
    if (this.states[this.state]?.enter) {
      this.states[this.state].enter(this, this.stateData);
    }
  }

  update(delta, context) {
    if (this.states[this.state]?.update) {
      this.states[this.state].update(this, delta, context);
    }
  }
}
